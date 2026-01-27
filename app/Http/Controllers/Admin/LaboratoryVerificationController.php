<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Laboratory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;


class LaboratoryVerificationController extends Controller
{
    /**
     * List all pending laboratories.
     */
    public function index()
    {
        // We query the 'Laboratory' model directly, not the User
        $pendingLabs = Laboratory::with('user') // Load the owner user
            ->where('verification_status', 'pending')
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/Verification/Laboratories', [
            'labs' => $pendingLabs
        ]);
    }

    /**
     * Download the proof document (Commercial Registry / Agreement).
     */
    public function downloadDocument(Laboratory $laboratory)
    {
        // Security check
        if (!$laboratory->document_path) {
            abort(404, 'Document not found.');
        }

        // Check if file exists in the 'private' disk
        if (!Storage::disk('private')->exists($laboratory->document_path)) {
            abort(404, 'File missing from storage.');
        }

        return Storage::disk('private')->download($laboratory->document_path);
    }

    /**
     * Approve or Reject the laboratory.
     */
    public function update(Request $request, Laboratory $laboratory)
    {
        $validated = $request->validate([
            'status' => 'required|in:verified,rejected',
            'reason' => 'required_if:status,rejected|nullable|string|max:255'
        ]);

        $laboratory->update([
            'verification_status' => $validated['status'],
            'rejection_reason' => $validated['status'] === 'rejected' ? $validated['reason'] : null
        ]);

        $message = $validated['status'] === 'verified'
            ? 'Laboratoire approuvé avec succès.'
            : 'Laboratoire rejeté.';

        return back()->with('success', $message);
    }
}
