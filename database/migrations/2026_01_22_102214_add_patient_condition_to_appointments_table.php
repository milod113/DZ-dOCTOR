<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            // We use 'patient_condition' to store the medical urgency
            $table->enum('patient_condition', ['stable', 'moyen', 'grave'])
                  ->default('stable')
                  ->after('type'); // Places it after the 'type' column
        });
    }

    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->dropColumn('patient_condition');
        });
    }
};
