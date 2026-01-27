<?php

namespace App\Http\Controllers\Booking;

use App\Http\Controllers\Controller;
use App\Models\DoctorProfile;
use App\Models\Slot;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AvailabilityController extends Controller
{
    // Inertia page: /booking/availability/{doctor}
   public function page(Request $request, DoctorProfile $doctor)
{
    $doctor->load(['clinics:id,name,city']);

    $data = $request->validate([
        'clinic_id' => ['nullable', 'integer'],
        'date'      => ['nullable', 'date'], // YYYY-MM-DD
    ]);

    $clinicId = $data['clinic_id'] ?? ($doctor->clinics->first()->id ?? null);
    $date     = $data['date'] ?? now('UTC')->toDateString();

    $slots = [];
    if ($clinicId) {
        $slots = Slot::where('doctor_profile_id', $doctor->id)
            ->where('clinic_id', $clinicId)
            ->whereDate('start_at', $date)
            ->where('status', 'available')
            ->orderBy('start_at')
            ->get(['id', 'start_at', 'end_at', 'status']);
    }

    return Inertia::render('Booking/Availability', [
        'doctor' => $doctor,
        'selected' => [
            'clinic_id' => $clinicId,
            'date'      => $date,
        ],
        'slots' => $slots,

        // ✅ Pass family members to the view
        'family_members' => auth()->check()
            ? auth()->user()->familyMembers()->get()
            : [],
    ]);
}

}
