<?php

namespace App\Http\Controllers\Imaging;

use App\Http\Controllers\Controller;
use App\Models\ImagingCenter;
use App\Models\ImagingExam; // Assuming you created this model earlier
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ImagingDashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // 1. Check if the Imaging Center profile exists
        $center = ImagingCenter::where('user_id', $user->id)->first();

        // 2. If NOT, redirect to the Setup Wizard
        if (!$center) {
            return redirect()->route('imaging.setup');
        }

        // 3. If YES, fetch stats for the Dashboard
        // (Mock data for now, replace with real relationships later)
        $stats = [
            'total_exams' => $center->exams()->count(),
            'appointments_today' => 0, // Placeholder for Appointment logic
            'revenue_month' => 0,      // Placeholder
            'verification_status' => $center->verification_status,
        ];

        return Inertia::render('Imaging/Dashboard', [
            'center' => $center,
            'stats' => $stats
        ]);
    }
}
