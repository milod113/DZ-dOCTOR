<?php

namespace App\Http\Controllers\Imaging;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ImagingExam; // Ensure this model exists
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class SettingsController extends Controller
{
    /**
     * Show the settings page with all tabs (General, Hours, Catalog).
     */
    public function index()
    {
        // Assuming relationship: User hasOne ImagingCenter
        $center = auth()->user()->imaging_center;

        // Load the catalog (Exams)
        // Ordered by modality (MRI, Scanner...) then by name
        $exams = $center->exams()->orderBy('modality')->orderBy('name')->get();

        return Inertia::render('Imaging/Settings/Index', [
            'center' => $center,
            'exams' => $exams
        ]);
    }

    /**
     * Update General Information, Equipment & Schedule.
     */
    public function updateProfile(Request $request)
    {
        $request->validate([
            'description' => 'nullable|string|max:1000',
            'opening_hours' => 'nullable|array',
            'logo' => 'nullable|image|max:2048',
            'phone' => 'required|string|max:20',
            'address' => 'required|string|max:255',

            // --- IMAGING SPECIFIC ---
            'equipment_list' => 'nullable|array', // e.g. ["IRM 3T", "Scanner"]
            'equipment_list.*' => 'string',
        ]);

        $center = auth()->user()->imaging_center;

        // Exclude logo (handled separately)
        $data = $request->except(['logo']);

        // Handle Logo Upload
        if ($request->hasFile('logo')) {
            // Delete old logo if exists
            if ($center->logo_path) {
                Storage::disk('public')->delete($center->logo_path);
            }
            $data['logo_path'] = $request->file('logo')->store('imaging_logos', 'public');
        }

        $center->update($data);

        return back()->with('success', 'Profil du centre mis à jour avec succès.');
    }

    /**
     * Add a new exam to the catalog.
     */
    public function storeExam(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255', // e.g. "IRM Cérébrale"
            'modality' => 'required|string|max:100', // e.g. "IRM", "Scanner", "Radio"
            'price' => 'nullable|numeric|min:0',
            'duration' => 'nullable|string|max:50', // e.g. "30 min"
            'preparation_notes' => 'nullable|string|max:500', // e.g. "À jeun"
        ]);

        auth()->user()->imaging_center->exams()->create($request->all());

        return back()->with('success', 'Examen ajouté au catalogue.');
    }

    /**
     * Delete an exam.
     */
    public function destroyExam(ImagingExam $exam)
    {
        // Security check: Ensure the exam belongs to the logged-in center
        if ($exam->imaging_center_id !== auth()->user()->imaging_center->id) {
            abort(403, 'Unauthorized action.');
        }

        $exam->delete();

        return back()->with('success', 'Examen supprimé du catalogue.');
    }
}
