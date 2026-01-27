<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('analysis_requests', function (Blueprint $table) {
            $table->id();

            // The Sender (Doctor)
            $table->foreignId('doctor_profile_id')->constrained()->onDelete('cascade');

            // The Receiver (Laboratory)
            $table->foreignId('laboratory_id')->constrained()->onDelete('cascade');

            // The Patient (Can be a registered User OR a Guest Name)
            $table->foreignId('patient_user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('guest_name')->nullable(); // If patient is not registered

            // The Prescription Data
            $table->json('tests_requested'); // Stores ["FNS", "Glycémie"]
            $table->text('doctor_notes')->nullable();

            // Status Workflow
            $table->enum('status', ['pending', 'received', 'processing', 'completed', 'cancelled'])
                  ->default('pending');

            // The Results (Filled later by Lab)
            $table->string('result_file_path')->nullable(); // PDF Path
            $table->text('result_comment')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('analysis_requests');
    }
};
