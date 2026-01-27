<?php

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use App\Models\Slot;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class SlotController extends Controller
{
  public function index(Request $request)
    {
        $doctor = $request->user()->doctorProfile;

        // Default to Today if no date provided
        $date = $request->input('date', now()->format('Y-m-d'));

        $slots = Slot::with(['clinic', 'appointment.patientUser']) // Eager load relationships
            ->where('doctor_profile_id', $doctor->id)
            ->whereDate('start_at', $date)
            ->orderBy('start_at')
            ->get()
            ->map(function ($slot) {
                return [
                    'id' => $slot->id,
                    'start_time' => $slot->start_at->format('H:i'),
                    'end_time' => $slot->end_at->format('H:i'),
                    'status' => $slot->status,
                    'clinic_name' => $slot->clinic->name,
                    // Use the Smart Accessor we created in the Model
                    'patient_name' => $slot->patient_name,
                    'is_booked' => $slot->status === 'booked',
                    // --- ADDED THIS LINE ---
                    'appointment_id' => $slot->appointment_id,
                ];
            });

        return Inertia::render('Doctor/Slots/Index', [
            'slots' => $slots,
            'filters' => [
                'date' => $date
            ]
        ]);
    }

    public function destroy(Slot $slot)
    {
        // Security check
        if ($slot->doctor_profile_id !== auth()->user()->doctorProfile->id) {
            abort(403);
        }

        if ($slot->status === 'booked') {
            return back()->with('error', 'Cannot delete a booked slot. Cancel the appointment first.');
        }

        $slot->delete();

        return back()->with('success', 'Slot deleted successfully.');
    }
}
