<?php

namespace App\Http\Controllers\Marketplace;

use App\Http\Controllers\Controller;
use App\Models\ImagingCenter;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ImagingSearchController extends Controller
{
    public function index(Request $request)
    {
        // 1. Validate Filters
        $filters = $request->validate([
            'city' => ['nullable', 'string', 'max:100'],
            'q' => ['nullable', 'string', 'max:100'], // Search query (Center Name)
            'modality' => ['nullable', 'string'],     // e.g., 'IRM', 'Scanner'
        ]);

        // 2. Build Query
        $query = ImagingCenter::query()
            ->where('verification_status', 'verified');

        // Filter by Name
        if (!empty($filters['q'])) {
            $q = $filters['q'];
            $query->where('name', 'like', "%{$q}%");
        }

        // Filter by City
        if (!empty($filters['city'])) {
            $city = $filters['city'];
            $query->where('city', 'like', "%{$city}%");
        }

        // Filter by Modality (e.g., User wants an "IRM")
        // We search within the 'equipment_list' JSON column or a related exams table
        if (!empty($filters['modality'])) {
            $modality = $filters['modality'];
            // Assuming 'equipment_list' is a JSON array of strings ["IRM", "Scanner"]
            // For MySQL 5.7+ / PostgreSQL use JSON_CONTAINS or similar
            $query->whereJsonContains('equipment_list', $modality);
        }

        // 3. Get Unique Cities & Modalities for Dropdowns
        $cities = ImagingCenter::where('verification_status', 'verified')
            ->distinct()->orderBy('city')->pluck('city');

        // Hardcoded list of common modalities for the filter
        $modalities = ['IRM', 'Scanner (TDM)', 'Radiographie', 'Échographie', 'Mammographie', 'Panoramique Dentaire'];

        return Inertia::render('Marketplace/ImagingSearch', [
            'filters' => $filters,
            'centers' => $query->latest()->paginate(12)->withQueryString(),
            'cities' => $cities,
            'modalities' => $modalities
        ]);
    }
}
