<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('analysis_requests', function (Blueprint $table) {
            // Priority & Urgency
            $table->string('priority')->default('normal'); // high, normal, low
            $table->string('urgency_level')->default('routine'); // emergency, urgent, routine

            // Medical Details
            $table->string('sample_type')->default('blood'); // blood, urine, etc.
            $table->boolean('fasting_required')->default(false);

            // Extra Instructions (separate from generic notes)
            $table->text('instructions')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('analysis_requests', function (Blueprint $table) {
            $table->dropColumn(['priority', 'urgency_level', 'sample_type', 'fasting_required', 'instructions']);
        });
    }
};
