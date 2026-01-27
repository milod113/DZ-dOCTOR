<?php

namespace App\Http\Controllers\Laboratory;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class VerificationController extends Controller
{
    public function show()
    {
        $lab = auth()->user()->laboratory;

        return Inertia::render('Laboratory/Verification/Show', [
            'status' => $lab->verification_status,
            'rejection_reason' => $lab->rejection_reason,
            'lab_name' => $lab->name
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'document' => 'required|file|mimes:pdf,jpg,png|max:5120', // Max 5MB
        ]);

        $lab = auth()->user()->laboratory;

        // Upload File
        $path = $request->file('document')->store('laboratory_documents', 'private');

        // Update DB
        $lab->update([
            'document_path' => $path,
            'verification_status' => 'pending',
            'rejection_reason' => null // Clear old rejections
        ]);

        return back()->with('success', 'Documents sent for verification.');
    }
}
