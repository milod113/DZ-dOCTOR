<?php
namespace App\Http\Controllers\Doctor\Secretary;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Appointment;
use Carbon\Carbon;
use Inertia\Inertia;

class CheckInController extends Controller
{
    // 1. Show the Scanner Page
    public function create()
    {
        return Inertia::render('Doctor/Secretary/Scan');
    }

    // 2. Handle the Scan (POST request)
    public function store(Request $request)
    {
        // Validate that we received a UUID
        $request->validate([
            'uuid' => 'required|string|exists:users,uuid'
        ]);

        // Find the Patient
        $patient = User::where('uuid', $request->uuid)->first();

        // Find TODAY'S Appointment for this patient
        // We look for appointments where the 'start_time' is today
        $appointment = Appointment::where('patient_id', $patient->id) // Ensure your column name is correct (patient_id or user_id)
            ->whereDate('start_time', Carbon::today())
            ->whereIn('status', ['confirmed', 'pending']) // Only check in valid appointments
            ->first();

        if (!$appointment) {
            return back()->with('error', "No appointment found for {$patient->name} today.");
        }

        // Update the status
        $appointment->update(['status' => 'arrived']);

        return back()->with('success', "✅ {$patient->name} marked as Arrived!");
    }
}
