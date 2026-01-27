<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DoctorVerificationController extends Controller
{
    public function index()
    {
        $pendingDoctors = User::where('role', 'doctor')
            ->where('verification_status', 'pending')
            ->with('doctorProfile') // Assuming you have this relation
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/Verification/Index', [
            'doctors' => $pendingDoctors
        ]);
    }

    public function downloadDocument(User $doctor)
    {
        // Security: Only admins can hit this route via middleware
        if (!$doctor->verification_document_path) {
            abort(404);
        }

        return Storage::download($doctor->verification_document_path);
    }

    public function update(Request $request, User $doctor)
    {
        $validated = $request->validate([
            'status' => 'required|in:approved,rejected'
        ]);

        $doctor->update([
            'verification_status' => $validated['status']
        ]);

        // Optional: Send email notification here

        return back()->with('success', "Doctor status updated to {$validated['status']}.");
    }
}
