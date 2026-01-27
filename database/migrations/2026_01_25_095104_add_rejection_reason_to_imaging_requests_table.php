<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('imaging_requests', function (Blueprint $table) {
            // Ajoute la colonne après 'notes' ou 'status'
            $table->text('rejection_reason')->nullable()->after('notes');
        });
    }

    public function down()
    {
        Schema::table('imaging_requests', function (Blueprint $table) {
            $table->dropColumn('rejection_reason');
        });
    }
};
