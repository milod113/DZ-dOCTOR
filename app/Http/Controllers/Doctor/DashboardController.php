<?php

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\DoctorProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // 1. Determine Context
        $doctorProfileId = null;
        if ($user->role === 'doctor') {
            $doctorProfileId = $user->doctorProfile?->id;
        } elseif ($user->role === 'secretary' && $user->employer_id) {
            $doctorProfileId = DoctorProfile::where('user_id', $user->employer_id)->value('id');
        }

        abort_unless($doctorProfileId, 403, 'No doctor profile found.');

        $today = Carbon::today();

        // 2. Fetch Common Data (Next Patient & Agenda)
        $nextAppointment = Appointment::with(['patientUser', 'slot'])
            ->where('doctor_profile_id', $doctorProfileId)
            ->whereIn('status', ['confirmed']) // Only confirmed people show up as "Next"
            ->whereHas('slot', fn($q) => $q->where('start_at', '>=', now())->whereDate('start_at', $today))
            ->orderBy('created_at', 'asc') // Better: Order by slot time
            ->first();

        $todayAppointments = Appointment::with(['patientUser', 'slot'])
            ->where('doctor_profile_id', $doctorProfileId)
            ->whereIn('status', ['confirmed', 'completed', 'pending', 'arrived']) // Show pending too so secretary knows who to expect
            ->whereHas('slot', fn($q) => $q->whereDate('start_at', $today))
            ->get()
            ->sortBy(fn($appt) => $appt->slot->start_at)
            ->values();

        // 3. SECRETARY SPECIFIC DATA: "Action Items"
        // Patients who booked online (status: pending) and need phone confirmation
        $appointmentsToConfirm = Appointment::with(['patientUser', 'slot'])
            ->where('doctor_profile_id', $doctorProfileId)
            ->where('status', 'pending')
            ->whereHas('slot', fn($q) => $q->where('start_at', '>=', now())) // Future only
            ->orderBy('created_at')
            ->limit(10)
            ->get();

        // 4. Stats
        $stats = [
            'today_count' => $todayAppointments->count(),
            'pending_requests' => Appointment::where('doctor_profile_id', $doctorProfileId)->where('status', 'pending')->count(),
            'completed_month' => Appointment::where('doctor_profile_id', $doctorProfileId)
                ->where('status', 'completed')
                ->whereMonth('created_at', now()->month)
                ->count(),
        ];

        return Inertia::render('Doctor/Dashboard', [
            'stats' => $stats,
            'next_appointment' => $nextAppointment,
            'today_appointments' => $todayAppointments,
            'appointments_to_confirm' => $appointmentsToConfirm, // <--- New Data for Secretary
            'is_secretary' => $user->role === 'secretary', // <--- Flag for UI
            'doctor_name' => $user->role === 'doctor' ? $user->name : 'Dr. ' . $user->employer->name
        ]);
    }
}
