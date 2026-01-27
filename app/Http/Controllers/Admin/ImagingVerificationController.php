<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ImagingCenter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ImagingVerificationController extends Controller
{
    /**
     * List all pending imaging centers.
     */
    public function index()
    {
        $pendingCenters = ImagingCenter::with('user') // Load the owner user
            ->where('verification_status', 'pending')
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/Verification/ImagingCenters', [
            'centers' => $pendingCenters
        ]);
    }

    /**
     * Download the proof document (Commercial Registry / Agreement).
     */
    public function downloadDocument(ImagingCenter $imagingCenter)
    {
        // Security check
        if (!$imagingCenter->document_path) {
            abort(404, 'Document not found.');
        }

        // Check if file exists in the 'private' disk
        if (!Storage::disk('private')->exists($imagingCenter->document_path)) {
            abort(404, 'File missing from storage.');
        }

        return Storage::disk('private')->download($imagingCenter->document_path);
    }

    /**
     * Approve or Reject the imaging center.
     */
    public function update(Request $request, ImagingCenter $imagingCenter)
    {
        $validated = $request->validate([
            'status' => 'required|in:verified,rejected',
            'reason' => 'required_if:status,rejected|nullable|string|max:255'
        ]);

        $imagingCenter->update([
            'verification_status' => $validated['status'],
            'rejection_reason' => $validated['status'] === 'rejected' ? $validated['reason'] : null
        ]);

        $message = $validated['status'] === 'verified'
            ? 'Centre d\'imagerie approuvé avec succès.'
            : 'Centre d\'imagerie rejeté.';

        return back()->with('success', $message);
    }
}
