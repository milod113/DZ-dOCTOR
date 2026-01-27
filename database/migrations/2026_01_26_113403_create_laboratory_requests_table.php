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
    Schema::create('laboratory_requests', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->foreignId('laboratory_id')->constrained()->onDelete('cascade');
        $table->foreignId('family_member_id')->nullable()->constrained()->onDelete('set null');

        // ... other fields ...

        // ✅ ADD THIS LINE
        $table->boolean('is_home_visit')->default(false);

        $table->string('status')->default('pending');
        $table->text('notes')->nullable();
        $table->string('prescription_path')->nullable();
        $table->json('test_ids')->nullable();
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('laboratory_requests');
    }
};
