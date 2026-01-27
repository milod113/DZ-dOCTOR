<?php

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use App\Models\DoctorSchedule;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ScheduleController extends Controller
{
    public function edit()
    {
        $profileId = auth()->user()->doctorProfile->id;
        // Fetch existing schedule or empty array
        $schedules = DoctorSchedule::where('doctor_profile_id', $profileId)->get();

        return Inertia::render('Doctor/Schedule/Edit', [
            'schedules' => $schedules
        ]);
    }

    public function update(Request $request)
    {
        $profile = auth()->user()->doctorProfile;
        $clinicId = $profile->clinics->first()->id; // Simplifying: assuming 1st clinic

        // Expecting an array of days [ { day_of_week: 1, start_time: '09:00', end_time: '17:00', is_active: true } ... ]
        $data = $request->validate([
            'schedules' => 'required|array',
            'schedules.*.day_of_week' => 'required|integer|between:0,6',
            'schedules.*.start_time' => 'required',
            'schedules.*.end_time' => 'required',
            'schedules.*.is_active' => 'boolean',
        ]);

        foreach ($data['schedules'] as $scheduleData) {
            DoctorSchedule::updateOrCreate(
                [
                    'doctor_profile_id' => $profile->id,
                    'clinic_id' => $clinicId,
                    'day_of_week' => $scheduleData['day_of_week']
                ],
                [
                    'start_time' => $scheduleData['start_time'],
                    'end_time' => $scheduleData['end_time'],
                    'is_active' => $scheduleData['is_active'],
                    'slot_duration_min' => $profile->consultation_duration_min
                ]
            );
        }

        // Trigger slot generation command (optional, usually run via cron)
        // Artisan::call('schedule:generate-slots');

        return back()->with('success', 'Schedule updated.');
    }
}
