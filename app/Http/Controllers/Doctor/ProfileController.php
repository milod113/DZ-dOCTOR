<?php

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage; // <--- IMPORTANT IMPORT
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function edit()
    {
        $locale = app()->getLocale();
        $translations = File::exists(resource_path("lang/{$locale}.json"))
            ? json_decode(File::get(resource_path("lang/{$locale}.json")), true)
            : [];

        return Inertia::render('Doctor/Profile/Edit', [
            // We must append 'photo_url' here so the frontend can use it
            'profile' => auth()->user()->doctorProfile->append('photo_url'),
            'translations' => $translations,
        ]);
    }

    public function update(Request $request)
    {
        $profile = auth()->user()->doctorProfile;

        $data = $request->validate([
            'bio' => 'nullable|string',
            'price_cents' => 'required|integer|min:0',
            'consultation_duration_min' => 'required|integer|min:5|max:120',
            'photo' => 'nullable|image|max:1024', // Max 1MB
        ]);

        // --- PHOTO UPLOAD LOGIC ---
        if ($request->hasFile('photo')) {
            // 1. Delete old photo if it exists (to save server space)
            if ($profile->profile_photo_path) {
                Storage::disk('public')->delete($profile->profile_photo_path);
            }

            // 2. Store the new photo
            $path = $request->file('photo')->store('doctor-photos', 'public');

            // 3. Update the model path
            $profile->profile_photo_path = $path;
        }

        // Update standard fields
        $profile->bio = $data['bio'];
        $profile->price_cents = $data['price_cents'];
        $profile->consultation_duration_min = $data['consultation_duration_min'];

        $profile->save();

        return back()->with('success', 'Profile updated successfully.');
    }
}
