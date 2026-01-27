<?php

namespace App\Http\Controllers\Marketplace;

use App\Http\Controllers\Controller;
use App\Models\ImagingCenter;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ImagingProfileController extends Controller
{


public function show($slug)
{
    // 1. Fetch the center by slug
    $center = ImagingCenter::where('slug', $slug)
        ->where('verification_status', 'verified')
        ->with(['exams' => function($query) {
            $query->orderBy('modality')->orderBy('name');
        }])
        ->firstOrFail();

    // 2. ✅ Fetch Family Members (only if user is logged in)
    $familyMembers = [];
    if (Auth::check()) {
        $familyMembers = Auth::user()->familyMembers()->get();
    }

    // 3. Pass data to the view
    return Inertia::render('Marketplace/ImagingProfile', [
        'center' => $center,
        'groupedExams' => $center->exams->groupBy('modality'),
        'family_members' => $familyMembers, // ✅ Pass as prop
    ]);
}
}
