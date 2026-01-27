<?php

namespace App\Http\Controllers;

use App\Models\DoctorProfile;
use App\Models\Laboratory;
use App\Models\User;
use App\Models\ImagingCenter;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WelcomeController extends Controller
{
    public function index()
    {
        // 1. Fetch Featured Doctors
        $doctors = DoctorProfile::with(['user', 'specialties', 'clinics'])
            ->where('is_active', true)
            ->inRandomOrder()
            ->take(4)
            ->get()
            ->map(function ($doc) {
                return [
                    'id' => $doc->id,
                    'name' => "Dr. {$doc->user->name}",
                    'specialty' => $doc->specialties->first()->name ?? 'Généraliste',
                    'city' => $doc->clinics->first()->city ?? 'Algérie',
                    'image' => $doc->profile_photo_url ?? "https://ui-avatars.com/api/?name={$doc->user->name}&background=0D8ABC&color=fff&size=300",
                ];
            });

        // 2. Fetch Featured Laboratories
        $laboratories = Laboratory::where('verification_status', 'verified')
            ->inRandomOrder()
            ->take(4)
            ->get()
            ->map(function ($lab) {
                return [
                    'id' => $lab->id,
                    'name' => $lab->name,
                    'city' => $lab->city,
                    'specialty' => $lab->specialty ?? 'Analyses Médicales',
                    'image' => $lab->logo_path
                        ? "/storage/{$lab->logo_path}"
                        : "https://ui-avatars.com/api/?name={$lab->name}&background=7C3AED&color=fff&size=300",
                ];
            });

        // 3. Fetch Featured Imaging Centers (UPDATED)
        $imagingCenters = ImagingCenter::where('verification_status', 'verified')
            ->inRandomOrder()
            ->take(4)
            ->get()
            ->map(function ($center) {
                // Get the first equipment as "specialty" display or default text
                $mainEquipment = !empty($center->equipment_list) && is_array($center->equipment_list)
                    ? $center->equipment_list[0]
                    : 'Radiologie Générale';

                return [
                    'id' => $center->id,
                    'name' => $center->name,
                    'slug' => $center->slug, // <--- ✅ ADDED SLUG HERE
                    'city' => $center->city,
                    'specialty' => $mainEquipment,
                    'image' => $center->logo_path
                        ? "/storage/{$center->logo_path}"
                        : "https://ui-avatars.com/api/?name={$center->name}&background=4F46E5&color=fff&size=300",
                ];
            });

        // 4. Calculate Stats
        $stats = [
            [
                'label' => 'Médecins',
                'value' => DoctorProfile::where('is_active', true)->count(),
                'icon' => 'stethoscope'
            ],
            [
                'label' => 'Laboratoires',
                'value' => Laboratory::where('verification_status', 'verified')->count(),
                'icon' => 'flask'
            ],
            [
                'label' => 'Centres Imagerie',
                'value' => ImagingCenter::where('verification_status', 'verified')->count(),
                'icon' => 'scan'
            ],
            [
                'label' => 'Patients Satisfaits',
                'value' => '15k+',
                'icon' => 'smile'
            ],
        ];

        return Inertia::render('Welcome', [
            'featuredDoctors' => $doctors,
            'featuredLaboratories' => $laboratories,
            'featuredImagingCenters' => $imagingCenters,
            'stats' => $stats
        ]);
    }
}
