<?php

namespace App\Http\Controllers\Laboratory;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\LaboratoryTest;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class SettingsController extends Controller
{
    /**
     * Show the settings page with all tabs (General, Hours, Catalog).
     */
    public function index()
    {
        $lab = auth()->user()->laboratory;

        // Load the catalog
        $tests = $lab->tests()->orderBy('category')->orderBy('name')->get();

        return Inertia::render('Laboratory/Settings/Index', [
            'lab' => $lab,
            'tests' => $tests
        ]);
    }

    /**
     * Update General Information & Schedule.
     */
  public function updateProfile(Request $request)
    {
        $request->validate([
            'description' => 'nullable|string|max:1000',
            'opening_hours' => 'nullable|array',
            'logo' => 'nullable|image|max:2048',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            // --- NEW FIELDS ---
            'offers_home_visit' => 'boolean',
            'home_visit_price' => 'nullable|numeric|min:0',
        ]);

        $lab = auth()->user()->laboratory;

        // Exclude logo (handled separately)
        $data = $request->except(['logo']);

        // Explicitly cast the boolean to ensure it saves as 0/1 correctly
        $data['offers_home_visit'] = $request->boolean('offers_home_visit');

        // Handle Logo Upload
        if ($request->hasFile('logo')) {
            $data['logo_path'] = $request->file('logo')->store('lab_logos', 'public');
        }

        $lab->update($data);

        return back()->with('success', 'Profil mis à jour avec succès.');
    }

    /**
     * Add a new test to the catalog.
     */
    public function storeTest(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'nullable|numeric',
            'category' => 'nullable|string|max:100',
            'conditions' => 'nullable|string|max:255',
        ]);

        auth()->user()->laboratory->tests()->create($request->all());

        return back()->with('success', 'Analyse ajoutée au catalogue.');
    }

    /**
     * Delete a test.
     */
    public function destroyTest(LaboratoryTest $test)
    {
        // Security check
        if ($test->laboratory_id !== auth()->user()->laboratory->id) {
            abort(403);
        }

        $test->delete();
        return back()->with('success', 'Analyse supprimée.');
    }
}
