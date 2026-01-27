<?php

namespace App\Http\Controllers\Laboratory;

use App\Http\Controllers\Controller;
use App\Models\Laboratory;
use App\Models\LaboratoryRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BookingController extends Controller
{

// Show the booking page for a specific lab
public function create(Request $request, Laboratory $laboratory)
{
    // 1. Load lab details
    $laboratory->load('user');

    // 2. Check for Home Visit query param (?type=home_visit)
    $isHomeVisit = $request->query('type') === 'home_visit';

    // 3. Return View
    return Inertia::render('Laboratory/Booking', [
        'laboratory' => $laboratory,
        'family_members' => Auth::check() ? Auth::user()->familyMembers()->get() : [],
        'is_home_visit' => $isHomeVisit,
    ]);
}

    // Store the request
    public function store(Request $request)
    {
        $request->validate([
            'laboratory_id' => 'required|exists:laboratories,id',
            'family_member_id' => 'nullable|exists:family_members,id',
            'notes' => 'nullable|string|max:500',
            'prescription_file' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120', // Max 5MB
            'is_home_visit' => 'boolean',
            ]);

        // Handle File Upload
        $path = null;
        if ($request->hasFile('prescription_file')) {
            $path = $request->file('prescription_file')->store('prescriptions', 'public');
        }

        LaboratoryRequest::create([
            'user_id' => Auth::id(),
            'laboratory_id' => $request->laboratory_id,
            'family_member_id' => $request->family_member_id, // ✅ Saved here
            'notes' => $request->notes,
            'prescription_path' => $path,
            'status' => 'pending',
            'is_home_visit' => $request->boolean('is_home_visit')

        ]);

        return redirect()->route('dashboard') // or patient.requests.index
            ->with('success', 'Votre demande a été envoyée au laboratoire.');
    }
}
