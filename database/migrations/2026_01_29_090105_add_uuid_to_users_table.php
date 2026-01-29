<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str; // Import Str

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        // Step 1: Add the column as NULLABLE first
        Schema::table('users', function (Blueprint $table) {
            $table->uuid('uuid')->nullable()->after('id');
        });

        // Step 2: Populate UUIDs for existing users
        DB::table('users')->orderBy('id')->chunk(200, function ($users) {
            foreach ($users as $user) {
                DB::table('users')
                    ->where('id', $user->id)
                    ->update(['uuid' => (string) Str::uuid()]);
            }
        });

        // Step 3: Now that data exists, make it UNIQUE and NOT NULL
        Schema::table('users', function (Blueprint $table) {
            $table->uuid('uuid')->nullable(false)->unique()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('uuid');
        });
    }
};
