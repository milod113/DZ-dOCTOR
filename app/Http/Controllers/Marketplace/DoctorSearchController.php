<?php

namespace App\Http\Controllers\Marketplace;

use App\Http\Controllers\Controller;
use App\Models\Clinic;
use App\Models\DoctorProfile;
use App\Models\Specialty;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DoctorSearchController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->validate([
            'city' => ['nullable','string','max:100'],
            'clinic_id' => ['nullable','integer','exists:clinics,id'],
            'specialty_id' => ['nullable','integer','exists:specialties,id'],
            'q' => ['nullable','string','max:100'],
        ]);

        $query = DoctorProfile::query()
            ->where('is_active', true)
            ->with(['clinics:id,name,city', 'specialties:id,name']);

        if (!empty($filters['q'])) {
            $q = $filters['q'];
            $query->where(function ($w) use ($q) {
                $w->where('first_name', 'ilike', "%{$q}%")
                  ->orWhere('last_name', 'ilike', "%{$q}%");
            });
        }

        if (!empty($filters['city'])) {
            $city = $filters['city'];
            $query->whereHas('clinics', fn ($c) => $c->where('city', 'ilike', "%{$city}%"));
        }

        if (!empty($filters['clinic_id'])) {
            $clinicId = (int)$filters['clinic_id'];
            $query->whereHas('clinics', fn ($c) => $c->where('clinics.id', $clinicId));
        }

        if (!empty($filters['specialty_id'])) {
            $specId = (int)$filters['specialty_id'];
            $query->whereHas('specialties', fn ($s) => $s->where('specialties.id', $specId));
        }

        return Inertia::render('Marketplace/Home', [
            'filters' => $filters,
            'doctors' => $query->orderBy('last_name')->paginate(12)->withQueryString(),
            'clinics' => Clinic::where('is_active', true)->orderBy('name')->get(['id','name','city']),
            'specialties' => Specialty::orderBy('name')->get(['id','name']),
        ]);
    }

public function show(DoctorProfile $doctor)
    {
        abort_unless($doctor->is_active, 404);

        $doctor->load([
            'clinics:id,name,city,address,phone,is_active',
            'specialties:id,name',
        ]);

        // Append the photo_url accessor we created in the model
        $doctor->append('photo_url');

        return Inertia::render('Marketplace/DoctorShow', [
            'doctor' => [
                'id' => $doctor->id,
                'first_name' => $doctor->first_name, // Added: Required by frontend
                'last_name' => $doctor->last_name,   // Added: Required by frontend
                'full_name' => trim($doctor->first_name.' '.$doctor->last_name),
                'bio' => $doctor->bio,
                'phone' => $doctor->phone,

                // --- ADDED PHOTO FIELDS ---
                'photo_url' => $doctor->photo_url,
                'profile_photo_path' => $doctor->profile_photo_path,

                'consultation_duration_min' => $doctor->consultation_duration_min,
                'price_cents' => $doctor->price_cents,

                'clinics' => $doctor->clinics
                    ->where('is_active', true)
                    ->map(fn ($c) => [
                        'id' => $c->id,
                        'name' => $c->name,
                        'city' => $c->city,
                        'address' => $c->address,
                        'phone' => $c->phone,
                    ])->values(),

                'specialties' => $doctor->specialties
                    ->map(fn ($s) => [
                        'id' => $s->id,
                        'name' => $s->name,
                    ])->values(),
            ],
        ]);
    }

}
