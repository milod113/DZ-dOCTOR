<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            // Nullable because Doctors don't have employers
            // Constrained to 'users' table (self-referencing)
            $table->foreignId('employer_id')
                  ->nullable()
                  ->after('id') // Optional: places it near the top
                  ->constrained('users')
                  ->onDelete('set null'); // If doctor is deleted, secretary becomes free agent
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['employer_id']);
            $table->dropColumn('employer_id');
        });
    }
};
