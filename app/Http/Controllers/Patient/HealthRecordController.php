<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use App\Models\AnalysisRequest;
use Illuminate\Http\Request; // Added missing import
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class HealthRecordController extends Controller
{
    /**
     * Show list of medical analyses (Appointments & Results).
     */
  public function index()
{
    // ❌ AVANT (Erreur) : with(['testType', ...])

    // ✅ APRÈS (Correct) : On ne charge que le labo et le docteur
    $analyses = AnalysisRequest::with(['laboratory', 'doctorProfile.user'])
        ->where('patient_user_id', auth()->id())
        ->latest()
        ->paginate(10);

    return Inertia::render('Patient/HealthRecords/Index', [
        'analyses' => $analyses
    ]);
}

    /**
     * Securely download the result.
     */
    public function download(AnalysisRequest $analysisRequest)
    {
        // 1. Security: Ensure this analysis belongs to the logged-in patient
        if ($analysisRequest->patient_user_id !== Auth::id()) {
            abort(403, 'Accès non autorisé.');
        }

        // 2. Check if file exists
        if (!$analysisRequest->result_file_path || !Storage::disk('local')->exists($analysisRequest->result_file_path)) {
            return back()->with('error', 'Le fichier n\'est pas disponible.');
        }

        // 3. Generate a dynamic filename (e.g., Resultat-BloodTest-2024-01-01.pdf)
        $date = $analysisRequest->created_at->format('Y-m-d');
        $testName = $analysisRequest->testType->name ?? 'Analyse';
        $filename = "Resultat-{$testName}-{$date}.pdf";

        // 4. Download from 'local' disk (Secure, not public)
        return Storage::disk('local')->download(
            $analysisRequest->result_file_path,
            $filename
        );
    }
}
