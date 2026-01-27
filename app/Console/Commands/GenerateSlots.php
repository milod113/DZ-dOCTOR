<?php

namespace App\Console\Commands;

use App\Models\DoctorSchedule;
use App\Models\ScheduleException;
use App\Models\Slot;
use Carbon\CarbonImmutable;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class GenerateSlots extends Command
{
    protected $signature = 'schedule:generate-slots {--days=45 : Generate slots for the next N days} {--cancel-invalid=1 : Cancel available slots that become invalid due to exceptions}';
    protected $description = 'Generate slot rows from weekly schedules + date exceptions (UTC).';

    public function handle(): int
    {
        $days = (int)$this->option('days');
        $cancelInvalid = (int)$this->option('cancel-invalid') === 1;

        $start = CarbonImmutable::now('UTC')->startOfDay();
        $end = $start->addDays($days)->endOfDay();

        $this->info("Generating slots from {$start->toDateString()} to {$end->toDateString()} (UTC) ...");

        $schedules = DoctorSchedule::query()
            ->where('is_active', true)
            ->get();

        if ($schedules->isEmpty()) {
            $this->warn("No active schedules found.");
            return self::SUCCESS;
        }

        // Preload exceptions in range for efficiency
        $exceptions = ScheduleException::query()
            ->whereBetween('date', [$start->toDateString(), $end->toDateString()])
            ->get()
            ->groupBy(fn ($e) => $e->doctor_profile_id.'|'.$e->clinic_id.'|'.$e->date->toDateString());

        $rows = [];
        $now = CarbonImmutable::now('UTC');

        foreach ($schedules as $schedule) {
            $cursor = $start;

            while ($cursor->lte($end)) {
                if ((int)$cursor->dayOfWeek !== (int)$schedule->day_of_week) {
                    $cursor = $cursor->addDay();
                    continue;
                }

                $key = $schedule->doctor_profile_id.'|'.$schedule->clinic_id.'|'.$cursor->toDateString();
                $exception = $exceptions->get($key)?->first();

                // If closed exception => skip generating
                if ($exception && $exception->is_closed) {
                    $cursor = $cursor->addDay();
                    continue;
                }

                $startTime = $exception && $exception->start_time ? $exception->start_time : $schedule->start_time;
                $endTime = $exception && $exception->end_time ? $exception->end_time : $schedule->end_time;

                $dayStart = CarbonImmutable::parse($cursor->toDateString().' '.$startTime, 'UTC');
                $dayEnd = CarbonImmutable::parse($cursor->toDateString().' '.$endTime, 'UTC');

                $slotMinutes = (int)$schedule->slot_duration_min;

                $slotStart = $dayStart;
                while ($slotStart->addMinutes($slotMinutes)->lte($dayEnd)) {
                    $slotEnd = $slotStart->addMinutes($slotMinutes);

                    // Don’t create slots in the past (keeps DB clean)
                    if ($slotStart->lt($now)) {
                        $slotStart = $slotStart->addMinutes($slotMinutes);
                        continue;
                    }

                    $rows[] = [
                        'doctor_profile_id' => $schedule->doctor_profile_id,
                        'clinic_id' => $schedule->clinic_id,
                        'start_at' => $slotStart->toDateTimeString(),
                        'end_at' => $slotEnd->toDateTimeString(),
                        'status' => 'available',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];

                    $slotStart = $slotStart->addMinutes($slotMinutes);
                }

                $cursor = $cursor->addDay();
            }
        }

        if (empty($rows)) {
            $this->warn("No slots to insert.");
            return self::SUCCESS;
        }

        // Bulk insert; ignore duplicates using Postgres ON CONFLICT DO NOTHING
        DB::statement('SET TIME ZONE \'UTC\'');

        $chunks = array_chunk($rows, 2000);
        $insertedApprox = 0;

        foreach ($chunks as $chunk) {
            // Using query builder upsert with empty update columns => emulate "do nothing" on conflict
            Slot::query()->upsert(
                $chunk,
                ['doctor_profile_id','clinic_id','start_at'],
                [] // no update
            );
            $insertedApprox += count($chunk);
        }

        $this->info("Inserted/attempted: {$insertedApprox} rows (duplicates skipped).");

        if ($cancelInvalid) {
            $this->cancelInvalidSlots($start, $end, $exceptions);
        }

        return self::SUCCESS;
    }

    private function cancelInvalidSlots(CarbonImmutable $start, CarbonImmutable $end, $exceptions): void
    {
        $this->info("Cancelling invalid available slots based on 'closed' exceptions...");

        // For each closed exception, cancel matching available slots on that date
        $closed = ScheduleException::query()
            ->whereBetween('date', [$start->toDateString(), $end->toDateString()])
            ->where('is_closed', true)
            ->get();

        foreach ($closed as $ex) {
            Slot::query()
                ->where('doctor_profile_id', $ex->doctor_profile_id)
                ->where('clinic_id', $ex->clinic_id)
                ->whereDate('start_at', $ex->date->toDateString())
                ->where('status', 'available')
                ->update(['status' => 'cancelled']);
        }
    }
}
