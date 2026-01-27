<?php

namespace Database\Seeders;

use App\Models\Clinic;
use App\Models\DoctorProfile;
use App\Models\DoctorSchedule;
use App\Models\Specialty;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class MarketplaceSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        User::updateOrCreate(
            ['email' => 'admin@booking.test'],
            [
                'name' => 'Admin',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        // Clinics
        $clinic1 = Clinic::updateOrCreate(
            ['slug' => 'clinique-centre-alger'],
            [
                'name' => 'Clinique Centre Alger',
                'address' => '12 Rue Exemple, Alger',
                'city' => 'Alger',
                'phone' => '+213 21 00 00 00',
                'is_active' => true,
            ]
        );

        $clinic2 = Clinic::updateOrCreate(
            ['slug' => 'clinique-oran-medic'],
            [
                'name' => 'Clinique Oran Medic',
                'address' => '5 Avenue Démo, Oran',
                'city' => 'Oran',
                'phone' => '+213 41 00 00 00',
                'is_active' => true,
            ]
        );

        // Specialties
        $specs = ['Cardiologie', 'Dermatologie', 'Pédiatrie', 'Généraliste'];
        $specialtyIds = [];
        foreach ($specs as $name) {
            $specialtyIds[$name] = Specialty::updateOrCreate(['name' => $name])->id;
        }

        // Doctors (3)
        $doctors = [
            [
                'email' => 'doctor1@booking.test',
                'first' => 'Sara',
                'last' => 'Benali',
                'spec' => 'Cardiologie',
                'clinics' => [$clinic1->id],
            ],
            [
                'email' => 'doctor2@booking.test',
                'first' => 'Yacine',
                'last' => 'Kaci',
                'spec' => 'Dermatologie',
                'clinics' => [$clinic1->id, $clinic2->id],
            ],
            [
                'email' => 'doctor3@booking.test',
                'first' => 'Nadia',
                'last' => 'Brahimi',
                'spec' => 'Pédiatrie',
                'clinics' => [$clinic2->id],
            ],
        ];

        foreach ($doctors as $d) {
            $user = User::updateOrCreate(
                ['email' => $d['email']],
                [
                    'name' => $d['first'].' '.$d['last'],
                    'password' => Hash::make('password'),
                    'role' => 'doctor',
                    'email_verified_at' => now(),
                ]
            );

            $profile = DoctorProfile::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'first_name' => $d['first'],
                    'last_name' => $d['last'],
                    'phone' => null,
                    'bio' => 'Bio de démonstration.',
                    'consultation_duration_min' => 15,
                    'price_cents' => 2500,
                    'is_active' => true,
                ]
            );

            $profile->clinics()->sync($d['clinics']);
            $profile->specialties()->sync([$specialtyIds[$d['spec']]]);

            // Mon-Fri 09:00-17:00, 15-min slots for each attached clinic
            foreach ($d['clinics'] as $clinicId) {
                for ($dow = 1; $dow <= 5; $dow++) {
                    DoctorSchedule::updateOrCreate(
                        [
                            'doctor_profile_id' => $profile->id,
                            'clinic_id' => $clinicId,
                            'day_of_week' => $dow,
                        ],
                        [
                            'start_time' => '09:00',
                            'end_time' => '17:00',
                            'slot_duration_min' => 15,
                            'is_active' => true,
                        ]
                    );
                }
            }
        }

        // Patient demo user
        User::updateOrCreate(
            ['email' => 'patient@booking.test'],
            [
                'name' => 'Patient Demo',
                'password' => Hash::make('password'),
                'role' => 'patient',
                'email_verified_at' => now(),
            ]
        );
    }
}
