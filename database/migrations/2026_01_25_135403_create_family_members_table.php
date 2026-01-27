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
    Schema::create('family_members', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade'); // The Account Holder
        $table->string('name');
        $table->string('relationship'); // 'child', 'spouse', 'parent', 'other'
        $table->date('date_of_birth')->nullable();
        $table->string('gender')->nullable(); // 'male', 'female'
        $table->string('blood_type')->nullable(); // Useful for medical history
        $table->timestamps();
    });

    // We also need to update the appointments table to link an appointment to a family member
    Schema::table('appointments', function (Blueprint $table) {
        $table->foreignId('family_member_id')->nullable()->after('patient_user_id')->constrained()->onDelete('set null');
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('family_members');
    }
};
