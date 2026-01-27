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
    Schema::create('imaging_requests', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade'); // The Patient
        $table->foreignId('imaging_center_id')->constrained()->onDelete('cascade'); // The Center
        $table->foreignId('imaging_exam_id')->nullable()->constrained()->onDelete('set null'); // The specific exam (e.g. IRM)

        $table->string('status')->default('pending'); // pending, confirmed, rejected, completed
        $table->datetime('requested_date');
        $table->string('prescription_path')->nullable(); // Photo of the doctor's paper
        $table->text('notes')->nullable();

        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('imaging_requests');
    }
};
