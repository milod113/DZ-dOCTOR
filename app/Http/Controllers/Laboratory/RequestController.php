<?php

namespace App\Http\Controllers\Laboratory;

use App\Http\Controllers\Controller;
use App\Models\AnalysisRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;

class RequestController extends Controller
{
    /**
     * The Inbox: List all requests sent to this laboratory.
     */

    public function index(Request $request)
    {
        $labId = auth()->user()->laboratory->id;

        // 1. Handle Filters
        $search = $request->input('search');
        $status = $request->input('status');
        $dateFilter = $request->input('date_filter');

        $query = AnalysisRequest::with(['doctorProfile.user', 'patientUser'])
            ->where('laboratory_id', $labId);

        // Apply Search
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('patientUser', function ($q2) use ($search) {
                    $q2->where('name', 'like', "%{$search}%");
                })
                ->orWhere('guest_name', 'like', "%{$search}%");
            });
        }

        // Apply Status
        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        // Apply Date Filters (Design has 'today', 'week', etc)
        if ($dateFilter) {
            if ($dateFilter === 'today') $query->whereDate('created_at', Carbon::today());
            if ($dateFilter === 'week') $query->whereBetween('created_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()]);
            if ($dateFilter === 'month') $query->whereMonth('created_at', Carbon::now()->month);
        }

        // 2. Fetch Paginated Results
        $requests = $query->latest()->paginate(9)->withQueryString(); // 9 for grid view

        // 3. Calculate Stats (Server Side for Accuracy)
        $stats = [
            'total' => AnalysisRequest::where('laboratory_id', $labId)->count(),
            'pending' => AnalysisRequest::where('laboratory_id', $labId)->where('status', 'pending')->count(),
            'processing' => AnalysisRequest::where('laboratory_id', $labId)->where('status', 'processing')->count(),
            'completed' => AnalysisRequest::where('laboratory_id', $labId)->where('status', 'completed')->whereDate('updated_at', Carbon::today())->count(), // Completed TODAY
            'avgResponseTime' => '2.4h', // You can calculate this dynamically later
            'satisfactionRate' => '98%',
        ];

        return Inertia::render('Laboratory/Requests/Index', [
            'requests' => $requests,
            'stats' => $stats,
            'filters' => $request->only(['search', 'status', 'date_filter'])
        ]);
    }

    // ... show, updateStatus, uploadResult methods remain the same


    /**
     * Show details of a specific request.
     */
// App\Http\Controllers\Laboratory\RequestController.php

public function show(AnalysisRequest $request)
{
    if ($request->laboratory_id !== auth()->user()->laboratory->id) {
        abort(403);
    }

    // Load relationships including the patient
    $request->load(['doctorProfile.user', 'patientUser']);

    return Inertia::render('Laboratory/Requests/Show', [
        'analysisRequest' => $request
    ]);
}

    /**
     * Update Status (e.g. "Received" -> "Processing")
     */
    public function updateStatus(Request $request, AnalysisRequest $analysisRequest)
    {
        if ($analysisRequest->laboratory_id !== auth()->user()->laboratory->id) abort(403);

        $validated = $request->validate([
            'status' => 'required|in:received,processing,cancelled'
        ]);

        $analysisRequest->update(['status' => $validated['status']]);

        return back()->with('success', 'Statut mis à jour.');
    }

    /**
     * The Big One: Uploading the PDF Result.
     */
    public function uploadResult(Request $request, AnalysisRequest $analysisRequest)
    {
        if ($analysisRequest->laboratory_id !== auth()->user()->laboratory->id) abort(403);

        $request->validate([
            'result_file' => 'required|file|mimes:pdf,jpg,png|max:5120', // Max 5MB
            'comment' => 'nullable|string'
        ]);

        // Upload to a private disk (so only patient/doctor can see it via a secure route)
        $path = $request->file('result_file')->store('analysis_results', 'private');

        $analysisRequest->update([
            'status' => 'completed',
            'result_file_path' => $path,
            'result_comment' => $request->comment
        ]);

        // TODO: Fire Event to Notify Doctor & Patient (We will do this later)

        return back()->with('success', 'Résultats envoyés avec succès !');
    }
}
