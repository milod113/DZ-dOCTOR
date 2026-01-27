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
    Schema::create('imaging_exams', function (Blueprint $table) {
        $table->id();
        $table->foreignId('imaging_center_id')->constrained()->onDelete('cascade');
        $table->string('name'); // e.g., "IRM Genou"
        $table->string('modality'); // e.g., "MRI", "CT-Scan", "X-Ray", "Ultrasound"
        $table->decimal('price', 10, 2)->nullable();
        $table->string('duration')->nullable(); // e.g., "30 min"
        $table->string('preparation_notes')->nullable(); // e.g., "Vessie pleine nécessaire"
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('imaging_exams');
    }
};
