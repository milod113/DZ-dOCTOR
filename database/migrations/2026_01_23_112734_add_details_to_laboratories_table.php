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
    Schema::table('laboratories', function (Blueprint $table) {
        // Presentation
        $table->text('description')->nullable(); // "Bio" or "About Us"
        $table->string('website')->nullable();
        $table->string('logo_path')->nullable();
        $table->string('cover_image_path')->nullable(); // For the profile header

        // Location Precision
        $table->decimal('latitude', 10, 8)->nullable();
        $table->decimal('longitude', 11, 8)->nullable();
        $table->string('google_maps_link')->nullable();

        // Schedule (JSON is easiest for Business Hours: Mon-Sun)
        // Example: {"monday": {"open": "08:00", "close": "17:00"}, ...}
        $table->json('opening_hours')->nullable();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('laboratories', function (Blueprint $table) {
            //
        });
    }
};
