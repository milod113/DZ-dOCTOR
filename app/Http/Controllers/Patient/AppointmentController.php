<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AppointmentController extends Controller
{
 public function index(Request $request)
    {
        // ✅ 1. Eager load 'familyMember'
        $query = Appointment::with(['doctorProfile.user', 'clinic', 'slot', 'familyMember'])
            ->join('slots', 'appointments.slot_id', '=', 'slots.id')
            ->where('appointments.patient_user_id', Auth::id())
            ->select('appointments.*');

        if ($request->filled('search')) {
            $search = $request->input('search');

            $query->where(function ($q) use ($search) {
                // Search by Status
                $q->where('appointments.status', 'like', "%{$search}%")

                // Search by Clinic Name
                  ->orWhereHas('clinic', function ($subQ) use ($search) {
                      $subQ->where('name', 'like', "%{$search}%");
                  })

                // Search by Doctor Name
                  ->orWhereHas('doctorProfile.user', function ($subQ) use ($search) {
                      $subQ->where('name', 'like', "%{$search}%");
                  })

                // ✅ 2. Search by Family Member Name
                  ->orWhereHas('familyMember', function ($subQ) use ($search) {
                      $subQ->where('name', 'like', "%{$search}%");
                  });
            });
        }

        $appointments = $query->orderBy('slots.start_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Patient/Appointments/Index', [
            'appointments' => $appointments,
            'filters' => $request->only(['search']),
        ]);
    }
public function show(Appointment $appointment)
{
    // 1. Security: Ensure the user owns this appointment
    if ($appointment->patient_user_id !== Auth::id()) {
        abort(403, 'Unauthorized');
    }

    // 2. Load relationships for the details view
    $appointment->load(['doctorProfile.user', 'clinic', 'slot', 'familyMember']);

    // 3. Return the view (You will need to create this file next)
    return Inertia::render('Patient/Appointments/Show', [
        'appointment' => $appointment
    ]);
}

}
