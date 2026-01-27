<?php

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Slot;
use App\Models\DoctorProfile;
use App\Models\AppointmentActivityLog; // Recommended for tracking
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AppointmentController extends Controller
{
    /**
     * Helper: Get the DoctorProfile ID based on who is logged in.
     * Handles both Doctor (self) and Secretary (employer).
     */
    private function getContextDoctorProfileId($user)
    {
        // 1. If I am the Doctor, return my own profile ID
        if ($user->role === 'doctor') {
            return $user->doctorProfile?->id;
        }

        // 2. If I am a Secretary, return my BOSS's profile ID
        if ($user->role === 'secretary' && $user->employer_id) {
            return DoctorProfile::where('user_id', $user->employer_id)->value('id');
        }

        return null;
    }

    /**
     * Display a listing of the doctor's appointments.
     */
 public function index(Request $request)
    {
        $user = $request->user();

        // 1. Get Context
        $doctorProfileId = $this->getContextDoctorProfileId($user);
        abort_unless($doctorProfileId, 403, 'Unauthorized: No associated doctor profile found.');

        // 2. Get Doctor Name (Required for WhatsApp Message)
        $doctorName = '';
        if ($user->role === 'doctor') {
            $doctorName = $user->name;
        } elseif ($user->role === 'secretary' && $user->employer_id) {
            // If Secretary, fetch the Employer's (Doctor's) name
            $doctorName = \App\Models\User::where('id', $user->employer_id)->value('name');
        }

        // 3. Fetch Appointments
        $appointments = Appointment::with([
            'slot',
            // IMPORTANT: We must select 'phone' for the WhatsApp button to work
            // for registered users (patient_user relationship)
            'patientUser' => function($query) {
                $query->select('id', 'name', 'email', 'phone');
            }
        ])
            ->where('doctor_profile_id', $doctorProfileId)
            ->when($request->date, function ($query, $date) {
                return $query->whereHas('slot', function ($q) use ($date) {
                    $q->whereDate('start_at', $date);
                });
            })
            ->when($request->status, function ($query, $status) {
                return $query->where('status', $status);
            })
            ->when($request->search, function ($query, $search) {
                return $query->where(function ($q) use ($search) {
                    $q->whereHas('patientUser', function ($subQ) use ($search) {
                        $subQ->where('name', 'like', "%{$search}%")
                             ->orWhere('email', 'like', "%{$search}%")
                             ->orWhere('phone', 'like', "%{$search}%");
                    })
                    ->orWhere('guest_name', 'like', "%{$search}%")
                    ->orWhere('guest_phone', 'like', "%{$search}%");
                });
            })
            ->orderByDesc('created_at')
            ->paginate(10)
            ->withQueryString();

        // 4. Fetch Slots
        $slots = Slot::where('doctor_profile_id', $doctorProfileId)
            ->where('status', 'available')
            ->where('start_at', '>=', now())
            ->when($request->date, function ($q, $date) {
                return $q->whereDate('start_at', $date);
            })
            ->orderBy('start_at')
            ->limit(20)
            ->get();

        return Inertia::render('Doctor/Appointments/Index', [
            'appointments' => $appointments,
            'slots'        => $slots,
            'filters'      => $request->only(['date', 'search', 'status']),
            'doctorName'   => $doctorName, // <--- Passing the name to Frontend
        ]);
    }

/**
     * Fetch upcoming appointments for the Bulk Reminder Modal.
     * Uses the same robust logic as index().
     */
public function fetchUpcoming(Request $request)
    {
        $user = $request->user();
        $doctorProfileId = $this->getContextDoctorProfileId($user);

        if (!$doctorProfileId) abort(403);

        // STRATEGY: Get ALL future confirmed/booked appointments
        // We do NOT limit by "Next 3 Days" in SQL to avoid timezone bugs.
        // We just grab the next 50 upcoming patients.
        $appointments = Appointment::with([
            'slot',
            'patientUser' => function($query) {
                $query->select('id', 'name', 'email', 'phone');
            }
        ])
        ->where('doctor_profile_id', $doctorProfileId)
        ->whereIn('status', ['confirmed', 'booked', 'in_progress']) // Include active ones
        // Ensure it has a slot
        ->whereHas('slot', function($q) {
            $q->where('start_at', '>=', now()->startOfDay()); // From Today onwards
        })
        ->get()
        // Sort by Slot Time in PHP (Safest)
        ->sortBy(function ($appt) {
            return $appt->slot->start_at;
        })
        ->take(50) // Limit to 50 results so the list isn't huge
        ->map(function ($appt) {
            $date = \Carbon\Carbon::parse($appt->slot->start_at);

            // Smart Label
            if ($date->isToday()) {
                $label = "Aujourd'hui";
                $color = "blue";
            } elseif ($date->isTomorrow()) {
                $label = "Demain";
                $color = "green";
            } else {
                $label = $date->translatedFormat('l d M'); // e.g. "Samedi 24 Jan"
                $color = "gray";
            }

            // Fallback Name Logic
            $name = $appt->guest_name ?? $appt->patientUser?->name ?? 'Patient Inconnu';
            $phone = $appt->guest_phone ?? $appt->patientUser?->phone ?? null;

            return [
                'id' => $appt->id,
                'name' => $name,
                'phone' => $phone,
                'time' => $date->format('H:i'),
                'date_label' => $label,
                'label_color' => $color, // Helper for frontend styling
                'date_human' => $date->translatedFormat('j F'),
                'raw_date' => $date->toDateString() // Helpful for debugging
            ];
        })
        ->values(); // Ensure clean JSON array

        return response()->json($appointments);
    }


    /**
     * Show details of a specific appointment.
     */
    public function show(Request $request, Appointment $appointment)
    {
        $user = $request->user();
        $doctorProfileId = $this->getContextDoctorProfileId($user);

        // Security: Ensure this appointment belongs to the current context
        if ($appointment->doctor_profile_id !== $doctorProfileId) {
            abort(403, 'Unauthorized access to this appointment.');
        }

        $appointment->load(['patientUser', 'slot', 'clinic', 'activityLogs.user']);

        return Inertia::render('Doctor/Appointments/Show', [
            'appointment' => $appointment
        ]);
    }

    /**
     * Update the status of an appointment.
     */
    public function updateStatus(Request $request, Appointment $appointment)
    {
        $user = $request->user();

        // FIX: Get the ID safely. DO NOT use $user->doctorProfile->id directly.
        $doctorProfileId = $this->getContextDoctorProfileId($user);

        // Security Check
        if (!$doctorProfileId || $appointment->doctor_profile_id !== $doctorProfileId) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'status' => 'required|in:confirmed,completed,cancelled,no_show,in_progress',
        ]);

        $appointment->update([
            'status' => $validated['status']
        ]);

        // OPTIONAL: Log this action so you know if the Secretary or Doctor clicked it
        /*
        AppointmentActivityLog::create([
            'appointment_id' => $appointment->id,
            'user_id' => $user->id,
            'doctor_id_snapshot' => $doctorProfileId,
            'action' => 'status_update_to_' . $validated['status']
        ]);
        */

        return back()->with('success', 'Appointment status updated.');
    }

    /**
     * Store a Walk-In Appointment.
     */
    public function storeWalkIn(Request $request)
    {
        $user = $request->user();
        $doctorProfileId = $this->getContextDoctorProfileId($user);

        if (!$doctorProfileId) {
            abort(403, 'Unauthorized action.');
        }

        $request->validate([
            'slot_id'     => 'required|exists:slots,id',
            'guest_name'  => 'required|string|max:255',
            'guest_phone' => 'nullable|string|max:20',
        ]);

        DB::transaction(function () use ($request, $doctorProfileId) {

            // 1. Lock the Slot AND Ensure it belongs to this doctor context
            $slot = Slot::where('id', $request->slot_id)
                ->where('doctor_profile_id', $doctorProfileId) // Critical Security Check
                ->lockForUpdate()
                ->firstOrFail();

            if ($slot->status !== 'available') {
                throw new \Exception("This slot is already taken.");
            }

            // 2. Create Appointment
            $appointment = Appointment::create([
                'doctor_profile_id' => $slot->doctor_profile_id,
                'clinic_id'         => $slot->clinic_id,
                'patient_user_id'   => null, // Walk-in has no account
                'slot_id'           => $slot->id,
                'status'            => 'confirmed',
                'type'              => 'walk_in',
                'guest_name'        => $request->guest_name,
                'guest_phone'       => $request->guest_phone,
            ]);

            // 3. Mark Slot as Booked
            $slot->update([
                'status' => 'booked',
                'appointment_id' => $appointment->id
            ]);
        });

        return back()->with('success', 'Walk-in appointment booked successfully.');
    }

/**
     * Store an Urgent/Forced Appointment (Creates a slot on the fly).
     */
 public function storeUrgent(Request $request)
    {
        $user = $request->user();
        $doctorProfileId = $this->getContextDoctorProfileId($user);

        if (!$doctorProfileId) abort(403);

        $validated = $request->validate([
            'date' => 'required|date|after_or_equal:today',
            'time' => 'required|date_format:H:i',
            'duration' => 'required|integer|min:5|max:60',
            'patient_name' => 'required|string|max:255',
            'reason' => 'nullable|string|max:255',
            // Validate the new condition field
            'patient_condition' => 'required|in:stable,moyen,grave',
        ]);

        $startAt = \Carbon\Carbon::parse($validated['date'] . ' ' . $validated['time']);
        $endAt = $startAt->copy()->addMinutes($validated['duration']);

        DB::transaction(function () use ($validated, $doctorProfileId, $startAt, $endAt) {

            // Get Clinic (Fix from previous step)
            $doctorProfile = DoctorProfile::findOrFail($doctorProfileId);
            $clinic = $doctorProfile->clinics()->first();

            // 1. Force Create Slot
            $slot = Slot::create([
                'doctor_profile_id' => $doctorProfileId,
                'clinic_id' => $clinic->id,
                'start_at' => $startAt,
                'end_at' => $endAt,
                'status' => 'booked',
            ]);

            // 2. Create Appointment
            Appointment::create([
                'doctor_profile_id' => $doctorProfileId,
                'clinic_id' => $clinic->id,
                'slot_id' => $slot->id,
                'status' => 'confirmed',

                // IMPORTANT: We use 'walk_in' because the database accepts it
                'type' => 'walk_in',

                // NEW: We save the urgency here
                'patient_condition' => $validated['patient_condition'],

                'guest_name' => $validated['patient_name'],
                'reason' => $validated['reason'] ?? 'Urgence',
            ]);
        });

        return back()->with('success', 'Patient ajouté en urgence !');
    }
public function show1(Appointment $appointment)
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
        $user = $request->user();

        // 1. SAME STRATEGY: Use the helper method for robust context retrieval
        $doctorProfileId = $this->getContextDoctorProfileId($user);

        // Security: If no profile found (e.g. unemployed secretary), deny access
        if (!$doctorProfileId) {
            abort(403, 'Unauthorized: No associated doctor profile found.');
        }

        // Security: Ensure the appointment belongs to the current doctor context
        if ($appointment->doctor_profile_id !== $doctorProfileId) {
            abort(403, 'Unauthorized action.');
        }

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

            // C. Update Appointment (SAME STRATEGY: Update Clinic ID too)
            // We must update the clinic_id to match the new slot, in case the doctor has multiple clinics.
            $appointment->update([
                'slot_id'   => $newSlot->id,
                'clinic_id' => $newSlot->clinic_id, // <--- Added for data integrity
                'status'    => 'confirmed'
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

        // SAME STRATEGY: Return back() instead of redirecting to a different page
        return back()->with('success', 'Rendez-vous déplacé avec succès.');
    }

}
