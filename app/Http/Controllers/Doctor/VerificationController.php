<?php

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class VerificationController extends Controller
{
    public function show()
    {
        return Inertia::render('Doctor/Verification/Show', [
            'status' => auth()->user()->verification_status,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'document' => 'required|file|mimes:pdf,jpg,jpeg,png|max:4096', // Max 4MB
        ]);

        $user = auth()->user();

        // 1. Store file in a private folder (not 'public')
        // 'verification-docs' folder inside storage/app/
        $path = $request->file('document')->store('verification-docs');

        // 2. Delete old file if exists
        if ($user->verification_document_path) {
            Storage::delete($user->verification_document_path);
        }

        // 3. Update User
        $user->update([
            'verification_document_path' => $path,
            'verification_status' => 'pending'
        ]);

        return back()->with('success', 'Document uploaded. Waiting for admin approval.');
    }
}
