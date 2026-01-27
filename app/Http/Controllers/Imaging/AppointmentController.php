<?php

namespace App\Http\Controllers\Imaging;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\ImagingRequest;

class AppointmentController extends Controller
{
    public function index()
    {
        $center = Auth::user()->imaging_center;

        // 1. Fetch Events
        $events = $center->requests()
            ->where('status', 'confirmed')
            ->with(['user', 'exam'])
            ->get()
            ->map(function ($appt) {
                $start = \Carbon\Carbon::parse($appt->requested_date);

                // ✅ Logic: Determine if it's a User or a Walk-in Guest
                $isWalkin = $appt->is_walkin;

                // Get Name
                $title = $isWalkin
                    ? ($appt->guest_name . ' (Ext)')
                    : ($appt->user ? $appt->user->name : 'Inconnu');

                // Get Phone
                $phone = $isWalkin
                    ? $appt->guest_phone
                    : ($appt->user ? $appt->user->phone : null);

                // Get Email
                $email = $isWalkin
                    ? $appt->guest_email
                    : ($appt->user ? $appt->user->email : null);

                return [
                    'id' => $appt->id,
                    'title' => $title,
                    'start' => $start->format('Y-m-d\TH:i:s'),
                    'end' => $start->copy()->addMinutes(30)->format('Y-m-d\TH:i:s'),
                    // ✅ Structure data for FullCalendar's 'extendedProps'
                    'extendedProps' => [
                        'exam' => $appt->exam->name ?? 'Examen',
                        'patient_phone' => $phone,
                        'patient_email' => $email,
                        'notes' => $appt->notes,
                        'status' => $appt->status,
                        'is_walkin' => $isWalkin,
                        'room' => null // Add room logic if you have it
                    ]
                ];
            });

        // 2. Fetch Exams for the dropdown
        $exams = $center->exams()->select('id', 'name')->get();

        return Inertia::render('Imaging/Appointments/Calendar', [
            'events' => $events,
            'exams'  => $exams
        ]);
    }
// ... imports

public function update(Request $request, $id)
{
    $request->validate([
        'start_date' => 'required|date',
    ]);

    $center = Auth::user()->imaging_center;

    // Find the appointment belonging to this center
    $appointment = $center->requests()->findOrFail($id);

    // Update the date
    $appointment->update([
        'requested_date' => $request->start_date,
    ]);

    return redirect()->back()->with('success', 'Rendez-vous déplacé avec succès.');
}
    // 3. Store Method (Updated for Walk-ins)
    public function store(Request $request)
    {
        // ✅ Dynamic Validation
        $request->validate([
            'is_walkin' => 'required|boolean',
            'imaging_exam_id' => 'required|exists:imaging_exams,id',
            'start_date' => 'required|date',
            'notes' => 'nullable|string',

            // Registered User Validation
            'patient_email' => 'required_if:is_walkin,false|nullable|email|exists:users,email',

            // Walk-in Guest Validation
            'guest_name' => 'required_if:is_walkin,true|nullable|string|max:255',
            'guest_phone' => 'required_if:is_walkin,true|nullable|string|max:255',
            'guest_email' => 'nullable|email',
        ]);

        $center = Auth::user()->imaging_center;
        $userId = null;

        // Find the patient ID if it's a registered user
        if (!$request->is_walkin) {
            $patient = User::where('email', $request->patient_email)->first();
            $userId = $patient->id;
        }

        // Create the appointment
        ImagingRequest::create([
            'imaging_center_id' => $center->id,
            'imaging_exam_id' => $request->imaging_exam_id,
            'requested_date' => $request->start_date,
            'status' => 'confirmed', // Auto-confirm
            'notes' => $request->notes,

            // ✅ Handle Guest vs User
            'is_walkin' => $request->is_walkin,
            'user_id' => $userId,
            'guest_name' => $request->is_walkin ? $request->guest_name : null,
            'guest_phone' => $request->is_walkin ? $request->guest_phone : null,
            'guest_email' => $request->is_walkin ? $request->guest_email : null,
        ]);

        return redirect()->back()->with('success', 'Rendez-vous ajouté avec succès.');
    }
}
