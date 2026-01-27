<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Laboratory;
use Inertia\Inertia;

class LaboratoryController extends Controller
{
    public function show($id)
    {
        // Fetch lab with its tests (assuming you have a relationship)
        $laboratory = Laboratory::with('tests')->findOrFail($id);

        return Inertia::render('Public/Laboratory/Show', [
            'lab' => $laboratory,
            // If you haven't built the 'tests' table yet, pass an empty array or mock data
            'tests' => $laboratory->tests ?? [],
        ]);
    }
}
