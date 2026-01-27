<?php

namespace App\Http\Controllers\Imaging;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ImagingRequest;
use Inertia\Inertia;
use Illuminate\Support\Facades\Notification; // Don't forget this import!

use App\Notifications\ImagingRequestUpdated;

class RequestController extends Controller
{
    /**
     * Display a listing of the requests.
     */
  public function index()
{
    // Assuming the authenticated user is the Imaging Center Manager
    $center = auth()->user()->imaging_center;

    $requests = $center->requests()
        // ✅ Add 'familyMember' to the eager loaded relationships
        ->with(['user', 'exam', 'familyMember'])
        ->latest()
        ->paginate(10);

    return Inertia::render('Imaging/Requests/Index', [
        'requests' => $requests
    ]);
}

    /**
     * Update the status (Accept/Reject).
     */
// N'oubliez pas d'importer la notification en haut


 // Ensure this is imported

public function update(Request $request, ImagingRequest $imagingRequest)
{
    // Authorization check (ensure the center owns this request)
    if ($request->user()->imaging_center->id !== $imagingRequest->imaging_center_id) {
        abort(403);
    }

    $action = $request->input('action');
    $message = '';

    switch ($action) {
        case 'confirm':
            $imagingRequest->update(['status' => 'confirmed']);
            $message = "Rendez-vous confirmé.";

            // Notification Logic
            if ($imagingRequest->user) {
                $imagingRequest->user->notify(new ImagingRequestUpdated($imagingRequest, 'confirm'));
            } elseif ($imagingRequest->guest_email) {
                Notification::route('mail', $imagingRequest->guest_email)
                    ->notify(new ImagingRequestUpdated($imagingRequest, 'confirm'));
            }
            break;

        case 'cancel':
            $validated = $request->validate([
                'rejection_reason' => 'required|string|max:255',
            ]);

            $imagingRequest->update([
                'status' => 'rejected',
                'rejection_reason' => $validated['rejection_reason']
            ]);
            $message = "Demande refusée.";

            // Notification Logic
            if ($imagingRequest->user) {
                $imagingRequest->user->notify(new ImagingRequestUpdated($imagingRequest, 'reject'));
            } elseif ($imagingRequest->guest_email) {
                Notification::route('mail', $imagingRequest->guest_email)
                    ->notify(new ImagingRequestUpdated($imagingRequest, 'reject'));
            }
            break;

        case 'reschedule':
            $validated = $request->validate([
                'new_date' => 'required|date|after:today',
            ]);

            $imagingRequest->update([
                'requested_date' => $validated['new_date'],
                'status' => 'confirmed', // Auto-confirm the new date
            ]);
            $message = "Rendez-vous reporté.";

            // Notification Logic
            if ($imagingRequest->user) {
                $imagingRequest->user->notify(new ImagingRequestUpdated($imagingRequest, 'reschedule'));
            } elseif ($imagingRequest->guest_email) {
                Notification::route('mail', $imagingRequest->guest_email)
                    ->notify(new ImagingRequestUpdated($imagingRequest, 'reschedule'));
            }
            break;

        case 'complete':
            $imagingRequest->update(['status' => 'completed']);
            $message = "Examen terminé.";

            // Notification Logic (Optional)
            if ($imagingRequest->user) {
                $imagingRequest->user->notify(new ImagingRequestUpdated($imagingRequest, 'complete'));
            } elseif ($imagingRequest->guest_email) {
                Notification::route('mail', $imagingRequest->guest_email)
                    ->notify(new ImagingRequestUpdated($imagingRequest, 'complete'));
            }
            break;

        default:
            return back()->with('error', 'Action inconnue.');
    }

    return back()->with('success', $message);
}

    /**
     * Download the prescription file.
     */
    public function downloadPrescription(ImagingRequest $imagingRequest)
    {
        if ($imagingRequest->imaging_center_id !== auth()->user()->imaging_center->id) {
            abort(403);
        }

        if (!$imagingRequest->prescription_path) {
            return back()->with('error', 'Aucune ordonnance trouvée.');
        }

        return response()->download(storage_path('app/public/' . $imagingRequest->prescription_path));
    }
}
