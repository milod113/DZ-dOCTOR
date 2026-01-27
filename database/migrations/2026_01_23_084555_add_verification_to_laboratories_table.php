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
        // Drop the simple boolean if it exists, replace with status
        $table->dropColumn('is_verified');

        $table->enum('verification_status', ['unsubmitted', 'pending', 'verified', 'rejected'])
              ->default('unsubmitted');
        $table->string('document_path')->nullable(); // Path to PDF/Image license
        $table->text('rejection_reason')->nullable();
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
