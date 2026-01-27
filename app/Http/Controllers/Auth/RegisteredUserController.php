<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\DoctorProfile; // ✅ Import this
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Clinic;

class RegisteredUserController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

 public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            // 1. Updated validation to include new actors
            'role' => 'required|string|in:patient,doctor,laboratory,imagerie,nurse,ambulance',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        // --- DOCTOR LOGIC ---
        // Doctors get a profile created immediately (empty/unverified)
        if ($user->role === 'doctor') {
            $nameParts = explode(' ', $user->name, 2);
            $firstName = $nameParts[0];
            $lastName = $nameParts[1] ?? '';

            DoctorProfile::create([
                'user_id' => $user->id,
                'first_name' => $firstName,
                'last_name' => $lastName,
                'is_active' => false,
            ]);
        }

        // --- LABORATORY LOGIC ---
        // We do NOT create the Laboratory model here.
        // Why? Because we need address, license, etc.
        // We just let them log in as a User. The 'lab.verified' middleware
        // will catch them on the dashboard and force them to /laboratory/setup

        event(new Registered($user));

        Auth::login($user);

        // --- DYNAMIC REDIRECT ---
        return match ($user->role) {
            'doctor' => redirect()->route('doctor.dashboard'),
            // This will trigger the Middleware -> Redirect to Setup
            'laboratory' => redirect()->route('laboratory.dashboard'),
            // Future implementations:
            'imagerie' => redirect()->route('imaging.dashboard'),
            // 'nurse' => redirect()->route('nurse.dashboard'),
            default => redirect(RouteServiceProvider::HOME),
        };
    }
}
