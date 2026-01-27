<?php

namespace App\Http\Controllers\Booking;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Slot;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;
use App\Notifications\NewAppointmentNotification;

class AppointmentController extends Controller
{

public function show(Appointment $appointment)
{
    $user = auth()->user();

    // 1. Security Check (Updated to allow Secretary)
    // Access allowed if: User is the Doctor OR User is the Secretary of the Doctor
    $isOwnerDoctor = $user->doctorProfile?->id === $appointment->doctor_profile_id;
    $isEmployedSecretary = $user->employer_id === $appointment->doctorProfile->user_id;

    if (!$isOwnerDoctor && !$isEmployedSecretary) {
        abort(403, 'Unauthorized action.');
    }

    // 2. Load relationships (Added 'activityLogs.user' for the Audit Timeline)
    $appointment->load(['patientUser', 'slot', 'clinic', 'activityLogs.user']);

    // 3. Find Nearby Available Slots (Suggestions for Rescheduling)
    // Logic: Same doctor, same clinic, status 'available', starting from today
    // We prioritize slots closest to the current appointment's date.
    $currentSlotDate = $appointment->slot->start_at;

    $nearbySlots = Slot::where('doctor_profile_id', $appointment->doctor_profile_id)
        ->where('clinic_id', $appointment->clinic_id) // Ideally keep same clinic
        ->where('status', 'available')
        ->where('start_at', '>', now()) // Must be in the future
        ->where('id', '!=', $appointment->slot_id) // Don't show the current slot
        // Optimize: Look for slots within a 7-day range of the current appointment
        ->whereBetween('start_at', [
            \Carbon\Carbon::parse($currentSlotDate)->subDays(1)->startOfDay(),
            \Carbon\Carbon::parse($currentSlotDate)->addDays(7)->endOfDay()
        ])
        ->orderBy('start_at', 'asc')
        ->take(10) // Limit to 10 suggestions
        ->get();

    return Inertia::render('Doctor/Appointments/Show', [
        'appointment' => $appointment,
        'nearbySlots' => $nearbySlots,
        // We pass a flag to tell the frontend if this is a Walk-in or Registered user easily
        'is_walk_in' => $appointment->type === 'walk_in',
    ]);
}

    /**
     * Handle the "Drag and Drop" Rescheduling.
     * Moves an appointment from Old Slot -> New Slot.
     */
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

    // POST /booking/appointments
public function store(Request $request)
{
   /// dd($request->all());
    $user = $request->user();

    $data = $request->validate([
        'slot_id'           => ['required', 'integer', 'exists:slots,id'],
        'reason'            => ['nullable', 'string', 'max:255'],
        'family_member_id'  => ['nullable', 'integer', 'exists:family_members,id'],
    ]);

    try {
        $appointment = DB::transaction(function () use ($data, $user) {
            // Lock slot to prevent race conditions
            $slot = Slot::where('id', $data['slot_id'])
                ->lockForUpdate()
                ->firstOrFail();

            // Checks
            if ($slot->start_at->isPast()) {
                throw new \Exception("Impossible de réserver un créneau passé.");
            }

            if ($slot->status !== 'available') {
                throw new \Exception("Ce créneau n'est plus disponible.");
            }

            // Validate family member belongs to current user (if provided)
            if (!empty($data['family_member_id'])) {
                $exists = \App\Models\FamilyMember::where('id', $data['family_member_id'])
                    ->where('user_id', $user->id)
                    ->exists();

                if (!$exists) {
                    abort(403, "Ce profil ne vous appartient pas.");
                }
            }

            // Create appointment
            $appointment = Appointment::create([
                'doctor_profile_id'  => $slot->doctor_profile_id,
                'clinic_id'          => $slot->clinic_id,
                'patient_user_id'    => $user->id,
                'slot_id'            => $slot->id,
                'status'             => 'pending',
                'reason'             => $data['reason'] ?? null,
                'family_member_id'   => $data['family_member_id'] ?? null, // ✅ store it
            ]);

            // Update slot
            $slot->update([
                'status'            => 'booked',
                'booked_by_user_id' => $user->id,
                'appointment_id'    => $appointment->id,
            ]);

            return $appointment;
        });

        // Notifications
        $doctorUser = optional($appointment->doctorProfile)->user;

        // A. Notify Doctor
        if ($doctorUser) {
            $doctorUser->notify(new NewAppointmentNotification(
                $appointment,
                "Nouveau rendez-vous confirmé avec " . $user->name
            ));

            // B. Notify Secretaries
            $secretaries = \App\Models\User::where('employer_id', $doctorUser->id)
                ->where('role', 'secretary')
                ->get();

            foreach ($secretaries as $secretary) {
                $secretary->notify(new NewAppointmentNotification(
                    $appointment,
                    "Nouveau rendez-vous (Via Web) : " . $user->name
                ));
            }
        }

        return redirect()->route('dashboard')
            ->with('success', 'Votre rendez-vous a été confirmé avec succès !');

    } catch (\Exception $e) {
        return back()
            ->withErrors(['slot_id' => $e->getMessage()])
            ->with('error', 'Échec de la réservation. Veuillez réessayer.');
    }
}

}
