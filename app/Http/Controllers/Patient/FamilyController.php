<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use App\Models\FamilyMember;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FamilyController extends Controller
{
    public function index()
    {
        return Inertia::render('Patient/Family/Index', [
            'members' => Auth::user()->familyMembers()->orderBy('created_at', 'desc')->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'relationship' => 'required|string|in:child,spouse,parent,other',
            'date_of_birth' => 'nullable|date',
            'gender' => 'required|in:male,female',
            'blood_type' => 'nullable|string|max:3',
        ]);

        Auth::user()->familyMembers()->create($validated);

        return back()->with('success', 'Membre ajouté avec succès.');
    }

    public function destroy(FamilyMember $familyMember)
    {
        if ($familyMember->user_id !== Auth::id()) {
            abort(403);
        }

        $familyMember->delete();
        return back()->with('success', 'Membre supprimé.');
    }
}
