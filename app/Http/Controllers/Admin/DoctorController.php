<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Clinic;
use App\Models\DoctorProfile;
use App\Models\Specialty;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class DoctorController extends Controller
{
    public function index()
    {
        $doctors = DoctorProfile::with(['user','clinics','specialties'])
            ->orderBy('last_name')
            ->paginate(10);

        return Inertia::render('Admin/Doctors/Index', [
            'doctors' => $doctors,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Doctors/Create', [
            'clinics' => Clinic::where('is_active', true)->orderBy('name')->get(['id','name','city']),
            'specialties' => Specialty::orderBy('name')->get(['id','name']),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            // Doctor user
            'email' => ['required','email','max:255','unique:users,email'],
            'password' => ['required','string','min:8'],

            // Profile
            'first_name' => ['required','string','max:100'],
            'last_name' => ['required','string','max:100'],
            'phone' => ['nullable','string','max:50'],
            'bio' => ['nullable','string'],
            'consultation_duration_min' => ['required','integer','min:5','max:180'],
            'price_cents' => ['required','integer','min:0'],
            'is_active' => ['boolean'],

            // Relations
            'clinic_ids' => ['required','array','min:1'],
            'clinic_ids.*' => ['integer','exists:clinics,id'],
            'specialty_ids' => ['required','array','min:1'],
            'specialty_ids.*' => ['integer','exists:specialties,id'],
        ]);

        DB::transaction(function () use ($data) {
            $user = User::create([
                'name' => $data['first_name'].' '.$data['last_name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'role' => 'doctor',
            ]);

            $profile = DoctorProfile::create([
                'user_id' => $user->id,
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'phone' => $data['phone'] ?? null,
                'bio' => $data['bio'] ?? null,
                'consultation_duration_min' => $data['consultation_duration_min'],
                'price_cents' => $data['price_cents'],
                'is_active' => $data['is_active'] ?? true,
            ]);

            $profile->clinics()->sync($data['clinic_ids']);
            $profile->specialties()->sync($data['specialty_ids']);
        });

        return redirect()->route('admin.doctors.index')->with('success', __('ui.saved'));
    }

    public function edit(DoctorProfile $doctor)
    {
        $doctor->load(['user','clinics','specialties']);

        return Inertia::render('Admin/Doctors/Edit', [
            'doctor' => $doctor,
            'clinics' => Clinic::where('is_active', true)->orderBy('name')->get(['id','name','city']),
            'specialties' => Specialty::orderBy('name')->get(['id','name']),
        ]);
    }

    public function update(Request $request, DoctorProfile $doctor)
    {
        $data = $request->validate([
            'first_name' => ['required','string','max:100'],
            'last_name' => ['required','string','max:100'],
            'phone' => ['nullable','string','max:50'],
            'bio' => ['nullable','string'],
            'consultation_duration_min' => ['required','integer','min:5','max:180'],
            'price_cents' => ['required','integer','min:0'],
            'is_active' => ['boolean'],

            'clinic_ids' => ['required','array','min:1'],
            'clinic_ids.*' => ['integer','exists:clinics,id'],
            'specialty_ids' => ['required','array','min:1'],
            'specialty_ids.*' => ['integer','exists:specialties,id'],
        ]);

        DB::transaction(function () use ($doctor, $data) {
            $doctor->update([
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'phone' => $data['phone'] ?? null,
                'bio' => $data['bio'] ?? null,
                'consultation_duration_min' => $data['consultation_duration_min'],
                'price_cents' => $data['price_cents'],
                'is_active' => $data['is_active'] ?? true,
            ]);

            $doctor->user->update([
                'name' => $data['first_name'].' '.$data['last_name'],
            ]);

            $doctor->clinics()->sync($data['clinic_ids']);
            $doctor->specialties()->sync($data['specialty_ids']);
        });

        return redirect()->route('admin.doctors.index')->with('success', __('ui.saved'));
    }
}
