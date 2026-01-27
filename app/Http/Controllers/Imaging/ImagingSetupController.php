<?php

namespace App\Http\Controllers\Imaging;

use App\Http\Controllers\Controller;
use App\Models\ImagingCenter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ImagingSetupController extends Controller
{
    // Show the Setup Form
    public function create()
    {
        // Prevent accessing setup if already setup
        if (ImagingCenter::where('user_id', Auth::id())->exists()) {
            return redirect()->route('imaging.dashboard');
        }

        return Inertia::render('Imaging/Setup');
    }

    // Save the new Imaging Center
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'phone' => 'required|string|max:20',
            'license_number' => 'required|string|max:50',
            'description' => 'nullable|string|max:1000',
        ]);

        $user = Auth::user();

        ImagingCenter::create([
            'user_id' => $user->id,
            'name' => $request->name,
            'slug' => Str::slug($request->name . '-' . uniqid()), // Unique slug
            'address' => $request->address,
            'city' => $request->city,
            'phone' => $request->phone,
            'license_number' => $request->license_number,
            'description' => $request->description,
            'verification_status' => 'pending', // Requires admin approval
        ]);

        return redirect()->route('imaging.dashboard');
    }
}
