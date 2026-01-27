<?php

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class TeamController extends Controller
{
    public function index()
    {
        $secretaries = User::where('employer_id', auth()->id())
            ->select('id', 'name', 'email', 'created_at') // Select specific fields
            ->get();

        return Inertia::render('Doctor/Team/Index', [
            'secretaries' => $secretaries
        ]);
    }

    /**
     * Show the form to create a new secretary.
     */
    public function create()
    {
        return Inertia::render('Doctor/Team/Create');
    }

    /**
     * Store a new secretary (or link existing).
     */
public function store(Request $request)
    {
        $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|email',
        ]);

        $doctor = auth()->user();
        $email = $request->email;

        // 1. Check if user exists
        $existingUser = User::where('email', $email)->first();

        if ($existingUser) {
            // Check if available
            if ($existingUser->employer_id) {
                return back()->withErrors(['email' => 'Cet utilisateur est déjà employé par un autre médecin.']);
            }
            if ($existingUser->role === 'doctor') {
                return back()->withErrors(['email' => 'Impossible d\'ajouter un médecin comme secrétaire.']);
            }

            // --- MANUAL UPDATE (Bypasses Fillable) ---
            $existingUser->employer_id = $doctor->id;
            $existingUser->role = 'secretary';
            $existingUser->save();
            // -----------------------------------------

            return redirect()->route('doctor.team.index')
                ->with('success', 'Utilisateur existant ajouté à votre équipe.');
        }

        // 2. Create new user
        $password = \Illuminate\Support\Str::random(10);

        // --- MANUAL CREATE (Bypasses Fillable) ---
        $user = new User();
        $user->name = $request->name;
        $user->email = $email;
        $user->password = \Illuminate\Support\Facades\Hash::make($password);
        $user->role = 'secretary';
        $user->verification_status = 'approved';
        $user->employer_id = $doctor->id; // Explicit assignment

        $user->save();
        // -----------------------------------------

        return redirect()->route('doctor.team.index')
            ->with('success', "Compte créé ! Mot de passe temporaire : $password");
    }

    public function removeSecretary(User $secretary)
    {
        if ($secretary->employer_id !== auth()->id()) abort(403);
        $secretary->update(['employer_id' => null]);
        return back()->with('success', 'Secrétaire retiré de l\'équipe.');
    }
}
