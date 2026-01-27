<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
  public function up()
{
    Schema::create('imaging_centers', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade'); // The owner
        $table->string('name');
        $table->string('slug')->unique();
        $table->string('address');
        $table->string('city');
        $table->string('phone');
        $table->string('email')->nullable();
        $table->string('website')->nullable();
        $table->text('description')->nullable();
        $table->string('logo_path')->nullable();
        $table->string('license_number')->nullable();

        // Specific Attributes
        $table->json('equipment_list')->nullable(); // e.g., ["IRM", "Scanner 64 barrettes", "Echo Doppler"]
        $table->json('opening_hours')->nullable();
        $table->enum('verification_status', ['pending', 'verified', 'rejected'])->default('pending');

        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('imaging_centers');
    }
};
