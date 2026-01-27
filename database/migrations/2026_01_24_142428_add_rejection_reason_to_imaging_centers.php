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
    Schema::table('imaging_centers', function (Blueprint $table) {
        $table->string('rejection_reason')->nullable()->after('verification_status');
    });
}

public function down()
{
    Schema::table('imaging_centers', function (Blueprint $table) {
        $table->dropColumn('rejection_reason');
    });
}
};
