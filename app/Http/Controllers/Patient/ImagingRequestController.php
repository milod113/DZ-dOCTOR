<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ImagingRequest;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ImagingRequestController extends Controller
{
    /**
     * Display a listing of the patient's imaging requests.
     */


public function index(Request $request)
{
    $requests = ImagingRequest::where('user_id', Auth::id())
        // ✅ 1. Load 'familyMember' so you can display the name in React
        ->with(['center', 'exam', 'familyMember'])
        ->latest()
        ->paginate(10);

    return Inertia::render('Patient/ImagingRequests/Index', [
        'requests' => $requests,
        // ✅ 2. Fixed: Use '$request->only' (input) not '$requests->only' (database result)
        'filters' => $request->only(['search', 'status']),
    ]);
}

  public function store(Request $request)
    {
        // 1. Check Auth
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        // 2. Validate
        $request->validate([
            'imaging_center_id' => 'required|exists:imaging_centers,id',
            'imaging_exam_id'   => 'required|exists:imaging_exams,id',
            'requested_date'    => 'required|date|after:today',
            // Expanded to allow PDF and larger files (10MB) for high-res scans
            'prescription'      => 'required|file|mimes:jpg,jpeg,png,pdf|max:10240',
            'notes'             => 'nullable|string|max:500',
            // ✅ Validate Family Member
            'family_member_id'  => 'nullable|exists:family_members,id',
        ]);

        // 3. Security: Ensure the family member belongs to this user
        if ($request->filled('family_member_id')) {
            $exists = \App\Models\FamilyMember::where('id', $request->family_member_id)
                ->where('user_id', Auth::id())
                ->exists();

            if (!$exists) {
                abort(403, "Ce profil ne vous appartient pas.");
            }
        }

        // 4. Handle File Upload
        $path = null;
        if ($request->hasFile('prescription')) {
            $path = $request->file('prescription')->store('imaging_prescriptions', 'public');
        }

        // 5. Create Request
        ImagingRequest::create([
            'user_id'           => Auth::id(),
            'imaging_center_id' => $request->imaging_center_id,
            'imaging_exam_id'   => $request->imaging_exam_id,
            // ✅ Save Family Member ID (or null for "Myself")
            'family_member_id'  => $request->family_member_id,
            'requested_date'    => $request->requested_date,
            'prescription_path' => $path,
            'notes'             => $request->notes,
            'status'            => 'pending'
        ]);

        return redirect()->route('dashboard')
            ->with('success', 'Votre demande de rendez-vous a été envoyée avec succès.');
    }
}
