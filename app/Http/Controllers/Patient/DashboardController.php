<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use App\Models\Appointment;
use App\Models\LaboratoryRequest; // ✅ Changed from AnalysisRequest
use App\Models\ImagingRequest;

class DashboardController extends Controller
{

    public function index()
    {
        $user = auth()->user();

        // --- 1. Doctor Appointments ---
        // Uses 'patient_user_id'
        $doctorAppts = Appointment::with(['doctorProfile.user', 'slot'])
            ->where('patient_user_id', $user->id)
            ->get() // Get all, don't filter by whereHas('slot') yet to debug
            ->filter(fn($appt) => $appt->slot != null) // Filter in PHP to be safe
            ->map(function ($appt) {
                // Determine Title
                $docName = $appt->doctorProfile->user->name ?? 'Doctor';

                return [
                    'id' => 'doc_' . $appt->id,
                    'title' => 'Dr. ' . $docName,
                    // Format date strictly for FullCalendar (ISO 8601)
                    'start' => $appt->slot->start_at,
                    'end'   => $appt->slot->end_at,
                    'extendedProps' => [
                        'type' => 'doctor',
                        'status' => $appt->status,
                        'description' => $appt->reason
                    ],
                    'backgroundColor' => '#3b82f6', // Blue
                    'borderColor' => '#2563eb',
                ];
            });

        // --- 2. Laboratory Requests ---
        // Uses 'user_id'
        $labAppts = LaboratoryRequest::with('laboratory')
            ->where('user_id', $user->id)
            ->get()
            ->map(function ($lab) {
                // Use created_at if no home_visit_date
                $date = $lab->home_visit_date ?? $lab->created_at;

                return [
                    'id' => 'lab_' . $lab->id,
                    'title' => 'Lab: ' . ($lab->laboratory->name ?? 'Laboratory'),
                    'start' => $date, // Laravel casts this automatically
                    'extendedProps' => [
                        'type' => 'laboratory',
                        'status' => $lab->status
                    ],
                    'backgroundColor' => '#10b981', // Green
                    'borderColor' => '#059669',
                ];
            });

        // --- 3. Imaging Requests ---
        // Uses 'user_id'
        $imagingAppts = ImagingRequest::with('center')
            ->where('user_id', $user->id)
            ->whereNotNull('requested_date')
            ->get()
            ->map(function ($img) {
                return [
                    'id' => 'img_' . $img->id,
                    'title' => 'Radio: ' . ($img->center->name ?? 'Imaging'),
                    'start' => $img->requested_date,
                    'extendedProps' => [
                        'type' => 'imaging',
                        'status' => $img->status
                    ],
                    'backgroundColor' => '#8b5cf6', // Purple
                    'borderColor' => '#7c3aed',
                ];
            });

        // --- 4. Combine All ---
        // Use concat() to simple append lists
        $events = $doctorAppts
            ->concat($labAppts)
            ->concat($imagingAppts)
            ->values() // Reset array keys
            ->all();   // Convert to plain array

        // --- 5. QR Code ---
        $qrCode = (string) QrCode::size(200)
            ->color(34, 40, 49)
            ->generate($user->uuid);

        return Inertia::render('Patient/Dashboard/Dashboard', [
            'qrCode' => $qrCode,
            'events' => $events,
            'auth' => ['user' => $user]
        ]);
    }
}

