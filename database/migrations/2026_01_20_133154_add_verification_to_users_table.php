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
    Schema::table('users', function (Blueprint $table) {
        $table->enum('verification_status', ['unverified', 'pending', 'approved', 'rejected'])
              ->default('unverified')
              ->after('email');
        $table->string('verification_document_path', 2048)
              ->nullable()
              ->after('verification_status');
    });
}

public function down()
{
    Schema::table('users', function (Blueprint $table) {
        $table->dropColumn(['verification_status', 'verification_document_path']);
    });
}
};
