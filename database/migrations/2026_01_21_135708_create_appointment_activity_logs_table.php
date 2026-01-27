<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('appointment_activity_logs', function (Blueprint $table) {
            $table->id();

            // The appointment being modified
            $table->foreignId('appointment_id')->constrained()->onDelete('cascade');

            // The user performing the action (Secretary or Doctor)
            $table->foreignId('user_id')->constrained();

            // CRITICAL: The historical context.
            // If the secretary changes jobs later, this ID remains unchanged here.
            $table->unsignedBigInteger('doctor_id_snapshot')->nullable();

            // What happened ('confirmed', 'cancelled', 'rescheduled')
            $table->string('action');

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('appointment_activity_logs');
    }
};
