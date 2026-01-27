<?php

namespace App\Http\Controllers\Marketplace;

use App\Http\Controllers\Controller;
use App\Models\Laboratory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LaboratorySearchController extends Controller
{
    public function index(Request $request)
    {
        // 1. Validate Filters
        $filters = $request->validate([
            'city' => ['nullable', 'string', 'max:100'],
            'q' => ['nullable', 'string', 'max:100'], // Search query (name)
            'home_visit' => ['nullable', 'boolean'],  // Filter by home visit capability
        ]);

        // 2. Build Query
        $query = Laboratory::query()
            ->where('verification_status', 'verified'); // Only show verified labs

        // Filter by Name
        if (!empty($filters['q'])) {
            $q = $filters['q'];
            $query->where('name', 'like', "%{$q}%"); // Or 'ilike' for Postgres
        }

        // Filter by City
        if (!empty($filters['city'])) {
            $city = $filters['city'];
            $query->where('city', 'like', "%{$city}%");
        }

        // Filter by Home Visit
        if (!empty($filters['home_visit']) && $filters['home_visit']) {
            $query->where('offers_home_visit', true);
        }

        // 3. Get Unique Cities for Dropdown
        $cities = Laboratory::where('verification_status', 'verified')
            ->distinct()
            ->orderBy('city')
            ->pluck('city');

        return Inertia::render('Marketplace/LaboratorySearch', [
            'filters' => $filters,
            'laboratories' => $query->latest()->paginate(12)->withQueryString(),
            'cities' => $cities,
        ]);
    }
}
