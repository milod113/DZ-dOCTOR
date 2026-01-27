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
    Schema::table('appointments', function (Blueprint $table) {
        // 1. Make user ID nullable (for walk-ins)
        $table->foreignId('patient_user_id')->nullable()->change();

        // 2. Add Guest Fields
        $table->string('guest_name')->nullable()->after('patient_user_id');
        $table->string('guest_phone')->nullable()->after('guest_name');

        // 3. Add a type flag (optional but useful for filtering)
        $table->enum('type', ['online', 'walk_in'])->default('online')->after('status');
    });
}

public function down()
{
    Schema::table('appointments', function (Blueprint $table) {
        $table->foreignId('patient_user_id')->nullable(false)->change();
        $table->dropColumn(['guest_name', 'guest_phone', 'type']);
    });
}
};
