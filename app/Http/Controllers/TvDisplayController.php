<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\DoctorProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TvDisplayController extends Controller
{
    public function show($doctorId)
    {
        // 1. Get Doctor & Clinic Info
        $doctor = DoctorProfile::with('user')->findOrFail($doctorId);

        // 2. Get the "Current" Patient (Status = 'in_progress')
        // This is the person who should appear BIG on the screen
        $current = Appointment::with(['patientUser', 'slot'])
            ->where('doctor_profile_id', $doctorId)
            ->whereDate('updated_at', now()) // Safety: only show today's active calls
            ->where('status', 'in_progress')
            ->latest('updated_at') // Get the most recently changed one
            ->first();

        // 3. Get the "Waiting" List (Status = 'confirmed' or 'arrived')
        // These appear smaller in the "Prochains" list
        $queue = Appointment::with(['patientUser', 'slot'])
            ->where('doctor_profile_id', $doctorId)
            ->whereHas('slot', function ($q) {
                $q->whereDate('start_at', now())
                  ->where('start_at', '>=', now()->subHours(1)); // Hide long past appts
            })
            ->whereIn('status', ['confirmed', 'arrived', 'pending'])
            ->orderBy('slot_id') // Order by time
            ->limit(5)
            ->get();

        return Inertia::render('Tv/Show', [
            'doctor' => $doctor,
            'current' => $current,
            'queue' => $queue,
            'date' => now()->translatedFormat('l j F Y'),
            // We pass a unique "trigger" based on the ID to help React know when to play sound
            'sound_trigger' => $current ? $current->id : 0
        ]);
    }
}
