<?php

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Laboratory;
use App\Models\AnalysisRequest;
use App\Models\User;
use Inertia\Inertia;

class AnalysisRequestController extends Controller
{
    /**
     * Show the form to create a new Analysis Request.
     * We pass the patient ID if we are coming from an appointment.
     */
    public function create(Request $request)
    {
        $patientId = $request->query('patient_id');
        $patient = $patientId ? User::find($patientId) : null;

        return Inertia::render('Doctor/Prescriptions/Create', [
            'patient' => $patient,
            // Pass common tests for a "Quick Pick" list
            'commonTests' => ['FNS', 'Glycémie', 'HbA1c', 'Urée', 'Créatinine', 'Cholestérol', 'Triglycérides']
        ]);
    }

    /**
     * API Endpoint: Search Laboratories live from the frontend.
     */
 public function searchLabs(Request $request)
    {
        $query = $request->input('query');
        $city = $request->input('city');

        $labs = Laboratory::query()
            ->where('verification_status', 'verified')
            ->when($query, function($q) use ($query) {
                $q->where('name', 'like', "%{$query}%");
            })
            ->when($city, function($q) use ($city) {
                $q->where('city', 'like', "%{$city}%");
            })
            ->take(10)
            ->get([
                'id', 'name', 'address', 'city', 'phone',
                'offers_home_visit', 'home_visit_price' // <--- Added these
            ]);

        return response()->json($labs);
    }

    /**
     * Store the request.
     */
 public function store(Request $request)
    {
        // 1. Validation
        $validated = $request->validate([
            'patient_user_id' => 'nullable|exists:users,id',
            'guest_name' => 'required_without:patient_user_id|string|nullable',
            'laboratory_id' => 'required|exists:laboratories,id',

            'tests' => 'required|array|min:1',
            'tests.*' => 'string',

            'note' => 'nullable|string', // General Notes

            // --- NEW FIELDS VALIDATION ---
            'priority' => 'required|in:high,normal,low',
            'urgency_level' => 'required|in:emergency,urgent,routine',
            'sample_type' => 'required|string',
            'fasting_required' => 'boolean',
            'instructions' => 'nullable|string', // Specific Lab Instructions
            'is_home_visit' => 'boolean',
            'home_visit_address' => 'nullable|required_if:is_home_visit,true|string|max:255',

            ]);

        // 2. Creation
        AnalysisRequest::create([
            'doctor_profile_id' => auth()->user()->doctorProfile->id,
            'laboratory_id' => $request->laboratory_id,
            'patient_user_id' => $request->patient_user_id,
            'guest_name' => $request->guest_name,

            'tests_requested' => $request->tests,
            'doctor_notes' => $request->note, // Maps 'note' from React to 'doctor_notes' in DB
            'status' => 'pending',

            // --- MAPPING NEW FIELDS ---
            'priority' => $request->priority,
            'urgency_level' => $request->urgency_level,
            'sample_type' => $request->sample_type,
            'fasting_required' => $request->fasting_required,
            'instructions' => $request->instructions,
        'is_home_visit' => $request->boolean('is_home_visit'),
            'home_visit_address' => $request->home_visit_address,

            ]);

        return redirect()->route('doctor.prescriptions.index')
            ->with('success', 'Prescription sent successfully!');
    }
/**
     * List all prescriptions sent by this doctor.
     */
    public function index()
    {
        $requests = AnalysisRequest::with(['laboratory', 'patientUser'])
            ->where('doctor_profile_id', auth()->user()->doctorProfile->id)
            ->latest()
            ->paginate(10);

        return Inertia::render('Doctor/Prescriptions/Index', [
            'requests' => $requests
        ]);
    }

    /**
     * Securely download the result PDF.
     */
    public function downloadResult(AnalysisRequest $analysisRequest)
    {
        // Security: Only the prescribing doctor (or admin/patient) can download
        if ($analysisRequest->doctor_profile_id !== auth()->user()->doctorProfile->id) {
            abort(403);
        }

        if (!$analysisRequest->result_file_path) {
            abort(404, "Le fichier n'existe pas.");
        }

        return \Illuminate\Support\Facades\Storage::disk('private')->download(
            $analysisRequest->result_file_path,
            'Resultat_Analyse_' . $analysisRequest->id . '.pdf'
        );
    }


}
