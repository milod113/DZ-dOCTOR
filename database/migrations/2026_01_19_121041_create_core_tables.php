<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Add role + phone to users
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('patient'); // admin, doctor, patient
            $table->string('phone')->nullable();
        });

        Schema::create('clinics', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('address');
            $table->string('city')->index();
            $table->string('phone');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('specialties', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // e.g., 'Cardiology'
            $table->timestamps();
        });

        Schema::create('doctor_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('first_name');
            $table->string('last_name');
            $table->text('bio')->nullable();
            $table->integer('consultation_duration_min')->default(30);
            $table->integer('price_cents')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Pivots
        Schema::create('doctor_clinic', function (Blueprint $table) {
            $table->id();
            $table->foreignId('doctor_profile_id')->constrained('doctor_profiles')->cascadeOnDelete();
            $table->foreignId('clinic_id')->constrained()->cascadeOnDelete();
            $table->unique(['doctor_profile_id', 'clinic_id'], 'uq_doc_clinic');
        });

        Schema::create('doctor_specialty', function (Blueprint $table) {
            $table->id();
            $table->foreignId('doctor_profile_id')->constrained('doctor_profiles')->cascadeOnDelete();
            $table->foreignId('specialty_id')->constrained()->cascadeOnDelete();
            $table->unique(['doctor_profile_id', 'specialty_id'], 'uq_doc_specialty');
        });

        // Scheduling
        Schema::create('doctor_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('doctor_profile_id')->constrained('doctor_profiles')->cascadeOnDelete();
            $table->foreignId('clinic_id')->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('day_of_week'); // 0=Sunday ... 6=Saturday
            $table->time('start_time');
            $table->time('end_time');
            $table->integer('slot_duration_min')->default(30);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            // Short explicit index name (avoid MySQL 64-char limit)
            $table->index(
                ['doctor_profile_id', 'clinic_id', 'day_of_week', 'is_active'],
                'idx_sched_doc_clinic_day_active'
            );
        });

        Schema::create('schedule_exceptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('doctor_profile_id')->constrained('doctor_profiles')->cascadeOnDelete();
            $table->foreignId('clinic_id')->constrained()->cascadeOnDelete();
            $table->date('date');
            $table->boolean('is_closed')->default(false);
            $table->time('start_time')->nullable(); // modified hours
            $table->time('end_time')->nullable();
            $table->string('note')->nullable();
            $table->timestamps();

            $table->unique(['doctor_profile_id', 'clinic_id', 'date'], 'uq_sched_exception');
        });

        // Slots (use DATETIME to avoid MySQL TIMESTAMP default issues)
        Schema::create('slots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('doctor_profile_id')->constrained('doctor_profiles')->cascadeOnDelete();
            $table->foreignId('clinic_id')->constrained()->cascadeOnDelete();

            $table->dateTime('start_at');
            $table->dateTime('end_at');

            $table->string('status')->default('available'); // available, booked, cancelled

            // Optimization indexes
            $table->index(['doctor_profile_id', 'clinic_id', 'status'], 'idx_slots_doc_clinic_status');
            $table->index('start_at', 'idx_slots_start_at');

            // Prevent duplicate slots
            $table->unique(['doctor_profile_id', 'clinic_id', 'start_at'], 'uq_slots_doc_clinic_start');

            $table->timestamps();
        });

        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('doctor_profile_id')->constrained('doctor_profiles');
            $table->foreignId('clinic_id')->constrained();
            $table->foreignId('patient_user_id')->constrained('users');
            $table->foreignId('slot_id')->unique()->constrained('slots');

            $table->string('status')->default('confirmed'); // pending, confirmed, cancelled, completed
            $table->text('reason')->nullable();
            $table->text('notes')->nullable(); // Doctor notes
            $table->timestamps();

            // Short explicit index name (avoid MySQL 64-char limit)
            $table->index(
                ['doctor_profile_id', 'clinic_id', 'patient_user_id', 'status'],
                'idx_appt_doc_clinic_patient_status'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
        Schema::dropIfExists('slots');
        Schema::dropIfExists('schedule_exceptions');
        Schema::dropIfExists('doctor_schedules');
        Schema::dropIfExists('doctor_specialty');
        Schema::dropIfExists('doctor_clinic');
        Schema::dropIfExists('doctor_profiles');
        Schema::dropIfExists('specialties');
        Schema::dropIfExists('clinics');

        // Remove columns added to users
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'role')) {
                $table->dropColumn('role');
            }
            if (Schema::hasColumn('users', 'phone')) {
                $table->dropColumn('phone');
            }
        });
    }
};
