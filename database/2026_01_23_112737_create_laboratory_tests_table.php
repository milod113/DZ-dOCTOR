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
    Schema::create('laboratory_tests', function (Blueprint $table) {
        $table->id();
        $table->foreignId('laboratory_id')->constrained()->onDelete('cascade');

        $table->string('name'); // e.g. "Numération Formule Sanguine (FNS)"
        $table->string('category')->nullable(); // e.g. "Hématologie", "Biochimie"
        $table->string('code')->nullable(); // Internal code e.g. "HEM01"

        $table->decimal('price', 10, 2)->nullable(); // Price in DZD
        $table->boolean('is_visible')->default(true); // Hide if temporarily unavailable

        $table->text('conditions')->nullable(); // e.g. "À jeun 12h", "Prélèvement matin"
        $table->string('turnaround_time')->nullable(); // e.g. "24h", "48h"

        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('laboratory_tests');
    }
};
