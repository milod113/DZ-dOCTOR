<?php

namespace App\Http\Controllers\Laboratory;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Laboratory;
use Inertia\Inertia;

class SetupController extends Controller
{
    /**
     * Show the form to create the laboratory profile.
     */
    public function create()
    {
        // If profile already exists, send them to dashboard/verification
        if (auth()->user()->laboratory) {
            return redirect()->route('laboratory.dashboard');
        }

        return Inertia::render('Laboratory/Setup/Create');
    }

    /**
     * Store the new laboratory profile.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255', // e.g. "Laboratoire El Shifa"
            'phone' => 'required|string|max:20',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'wilaya' => 'required|string|max:100',
            'license_number' => 'required|string|max:100',
        ]);

        Laboratory::create([
            'user_id' => auth()->id(),
            'name' => $request->name,
            'phone' => $request->phone,
            'address' => $request->address,
            'city' => $request->city,
            'wilaya' => $request->wilaya,
            'license_number' => $request->license_number,
            'verification_status' => 'unsubmitted'
        ]);

        return redirect()->route('laboratory.verification.show')
            ->with('success', 'Profile created! Please upload your documents.');
    }
}
