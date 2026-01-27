<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('imaging_requests', function (Blueprint $table) {
            // ✅ Add the column after 'user_id' (or wherever you prefer)
            $table->foreignId('family_member_id')
                  ->nullable()
                  ->after('user_id')
                  ->constrained('family_members')
                  ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('imaging_requests', function (Blueprint $table) {
            // Drop foreign key first, then the column
            $table->dropForeign(['family_member_id']);
            $table->dropColumn('family_member_id');
        });
    }
};
