<?php

namespace App\Http\Controllers\Laboratory;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AnalysisRequest;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $labId = auth()->user()->laboratory->id;

        // 1. Calculate Stats
        $stats = [
            'pending' => AnalysisRequest::where('laboratory_id', $labId)
                ->where('status', 'pending')
                ->count(),

            'processing' => AnalysisRequest::where('laboratory_id', $labId)
                ->where('status', 'processing')
                ->count(),

            'completed_today' => AnalysisRequest::where('laboratory_id', $labId)
                ->where('status', 'completed')
                ->whereDate('updated_at', Carbon::today())
                ->count(),

            'total_requests' => AnalysisRequest::where('laboratory_id', $labId)->count(),
        ];

        // 2. Get Recent Requests (Last 5)
        $recentRequests = AnalysisRequest::where('laboratory_id', $labId)
            ->with(['doctorProfile.user', 'patientUser'])
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Laboratory/Dashboard', [
            'stats' => $stats,
            'recentRequests' => $recentRequests
        ]);
    }
}
