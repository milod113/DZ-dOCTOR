<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Clinic;
use App\Models\DoctorProfile;
use App\Models\DoctorSchedule;
use App\Models\ScheduleException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ScheduleController extends Controller
{
    public function edit(DoctorProfile $doctor)
    {
        $doctor->load(['clinics']);

        return Inertia::render('Admin/Schedules/Edit', [
            'doctor' => $doctor,
            'clinics' => $doctor->clinics()->get(['clinics.id','clinics.name','clinics.city']),
            'schedules' => DoctorSchedule::where('doctor_profile_id', $doctor->id)->get(),
            'exceptions' => ScheduleException::where('doctor_profile_id', $doctor->id)
                ->orderByDesc('date')
                ->limit(50)
                ->get(),
        ]);
    }

    public function upsertWeekly(Request $request, DoctorProfile $doctor)
    {
        $data = $request->validate([
            'items' => ['required','array','min:1'],
            'items.*.clinic_id' => ['required','integer','exists:clinics,id'],
            'items.*.day_of_week' => ['required','integer','min:0','max:6'],
            'items.*.start_time' => ['required','date_format:H:i'],
            'items.*.end_time' => ['required','date_format:H:i','after:items.*.start_time'],
            'items.*.slot_duration_min' => ['required','integer','min:5','max:180'],
            'items.*.is_active' => ['boolean'],
        ]);

        DB::transaction(function () use ($doctor, $data) {
            foreach ($data['items'] as $item) {
                DoctorSchedule::updateOrCreate(
                    [
                        'doctor_profile_id' => $doctor->id,
                        'clinic_id' => $item['clinic_id'],
                        'day_of_week' => $item['day_of_week'],
                    ],
                    [
                        'start_time' => $item['start_time'],
                        'end_time' => $item['end_time'],
                        'slot_duration_min' => $item['slot_duration_min'],
                        'is_active' => $item['is_active'] ?? true,
                    ]
                );
            }
        });

        return back()->with('success', __('ui.saved'));
    }

    public function addException(Request $request, DoctorProfile $doctor)
    {
        $data = $request->validate([
            'clinic_id' => ['required','integer','exists:clinics,id'],
            'date' => ['required','date'],
            'is_closed' => ['required','boolean'],
            'start_time' => ['nullable','date_format:H:i'],
            'end_time' => ['nullable','date_format:H:i'],
            'note' => ['nullable','string','max:255'],
        ]);

        if (!$data['is_closed']) {
            // Open override must have times
            $request->validate([
                'start_time' => ['required','date_format:H:i'],
                'end_time' => ['required','date_format:H:i','after:start_time'],
            ]);
        }

        ScheduleException::updateOrCreate(
            [
                'doctor_profile_id' => $doctor->id,
                'clinic_id' => $data['clinic_id'],
                'date' => $data['date'],
            ],
            [
                'is_closed' => $data['is_closed'],
                'start_time' => $data['start_time'] ?? null,
                'end_time' => $data['end_time'] ?? null,
                'note' => $data['note'] ?? null,
            ]
        );

        return back()->with('success', __('ui.saved'));
    }

    public function deleteException(DoctorProfile $doctor, ScheduleException $exception)
    {
        abort_unless($exception->doctor_profile_id === $doctor->id, 404);
        $exception->delete();

        return back()->with('success', __('ui.saved'));
    }
}
