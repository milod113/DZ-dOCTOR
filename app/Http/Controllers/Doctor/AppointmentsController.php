<?php

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\AppointmentActivityLog; // Don't forget this import
use App\Models\DoctorProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use App\Models\Slot;

use Illuminate\Support\Facades\Log;
use App\Notifications\AppointmentStatusNotification;

class AppointmentsController extends Controller
{
    /**
     * Helper to get the correct Doctor Profile ID.
     * Works for both the Doctor (self) and the Secretary (employer).
     */
    private function getContextDoctorProfileId($user)
    {
        if ($user->role === 'doctor') {
            return $user->doctorProfile?->id;
        }

        if ($user->role === 'secretary' && $user->employer_id) {
            // Find the profile of the doctor who employs this secretary
            return DoctorProfile::where('user_id', $user->employer_id)->value('id');
        }

        return null;
    }

    public function index(Request $request)
    {
        $user = $request->user();

        // 1. Determine which Doctor's data to show
        $doctorProfileId = $this->getContextDoctorProfileId($user);

        abort_unless($doctorProfileId, 403, 'No associated doctor profile found.');

        // 2. Fetch Appointments for that Doctor
        $appointments = Appointment::with([
                'clinic:id,name,city',
                'patientUser:id,name,email', // Changed 'patient' to 'patientUser' to match model
                'slot:id,start_at,end_at'
            ])
            ->where('doctor_profile_id', $doctorProfileId)
            ->whereIn('status', ['confirmed', 'completed', 'no_show', 'cancelled']) // Added cancelled for history visibility
            ->orderByDesc('created_at')
            ->paginate(15);

        return Inertia::render('Doctor/Appointments/Index', [
            'appointments' => $appointments,
        ]);
    }

    public function updateStatus(Request $request, Appointment $appointment)
    {
        $user = $request->user();
        $contextProfileId = $this->getContextDoctorProfileId($user);

        // 1. Security Check: Ensure the user is authorized for this specific appointment
        abort_unless($contextProfileId && $appointment->doctor_profile_id === $contextProfileId, 403);

        // 2. Validate
        $data = $request->validate([
            'status' => ['required', 'in:confirmed,completed,no_show,cancelled'],
        ]);

        // 3. Update Appointment
        $appointment->update([
            'status' => $data['status'],
        ]);

        // --- AUDIT TRAIL (NEW) ---
        // Record who performed this action for historical proof
        AppointmentActivityLog::create([
            'appointment_id'     => $appointment->id,
            'user_id'            => $user->id, // The actor (Doctor or Secretary)
            'doctor_id_snapshot' => $user->role === 'doctor' ? $user->id : $user->employer_id, // The context
            'action'             => $data['status'],
        ]);
        // -------------------------

        // --- NOTIFICATION LOGIC ---
        Log::info("DoctorAppt: Status updated for Appt ID {$appointment->id} to '{$data['status']}' by User {$user->id}");

        $patientUser = $appointment->patientUser;

        if ($patientUser) {
            // Only notify valid users (skip Walk-ins or Guests without accounts)
            try {
                $patientUser->notify(new AppointmentStatusNotification(
                    $appointment,
                    $data['status']
                ));
                Log::info("DoctorAppt: Notification dispatched to User ID {$patientUser->id}.");
            } catch (\Exception $e) {
                Log::error("DoctorAppt: Failed to send notification: " . $e->getMessage());
            }
        }
        // --------------------------

        return back()->with('success', __('ui.saved'));
    }

 public function reschedule(Request $request, Appointment $appointment)
    {
        $user = auth()->user();

        // --- 1. CONTEXT LOGIC (Fix for Secretary) ---
        $doctorProfileId = null;

        if ($user->role === 'doctor') {
            $doctorProfileId = $user->doctorProfile?->id;
        } elseif ($user->role === 'secretary' && $user->employer_id) {
            // Get the profile ID of the doctor they work for
            $doctorProfileId = \App\Models\DoctorProfile::where('user_id', $user->employer_id)->value('id');
        }

        // Security Check: Does the user have the right to touch this appointment?
        if (!$doctorProfileId || $appointment->doctor_profile_id !== $doctorProfileId) {
            abort(403, 'Unauthorized action.');
        }
        // ---------------------------------------------

        $request->validate([
            'new_slot_id' => 'required|exists:slots,id',
        ]);

        DB::transaction(function () use ($request, $appointment, $doctorProfileId) {

            // A. Get and Lock the New Slot
            // Security: Ensure the new slot actually belongs to the SAME doctor
            $newSlot = Slot::where('id', $request->new_slot_id)
                ->where('doctor_profile_id', $doctorProfileId) // Critical check
                ->lockForUpdate()
                ->firstOrFail();

            if ($newSlot->status !== 'available') {
                throw new \Exception("The selected slot is no longer available.");
            }

            // B. Get the Old Slot
            $oldSlot = Slot::where('id', $appointment->slot_id)->first();

            // C. Update Appointment
            $appointment->update([
                'slot_id' => $newSlot->id,
                // Keep status confirmed
                'status' => 'confirmed'
            ]);

            // D. Free up the Old Slot
            if ($oldSlot) {
                $oldSlot->update([
                    'status' => 'available',
                    'appointment_id' => null,
                    'booked_by_user_id' => null
                ]);
            }

            // E. Occupy the New Slot
            $newSlot->update([
                'status' => 'booked',
                'appointment_id' => $appointment->id,
                // If it's a walk-in, booked_by is null. If it's a user, it's their ID.
                'booked_by_user_id' => $appointment->patient_user_id
            ]);
        });

        return redirect()->route('doctor.slots.index')
            ->with('success', 'Rendez-vous déplacé avec succès.');
    }


}
