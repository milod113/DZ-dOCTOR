<?php

namespace App\Http\Controllers;

abstract class Controller
{
    // app/Http/Controllers/Controller.php

public function getCurrentDoctorId()
{
    $user = auth()->user();

    if ($user->role === 'doctor') {
        return $user->id; // I am the doctor
    }

    if ($user->role === 'secretary') {
        return $user->employer_id; // I work for the doctor
    }

    abort(403, 'No associated doctor found.');
}

// Helper to get the Doctor Profile ID (often needed for relationships)
public function getCurrentDoctorProfileId()
{
    $userId = $this->getCurrentDoctorId();
    return \App\Models\DoctorProfile::where('user_id', $userId)->value('id');
}
}
