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
    // Ajouter l'option au profil du labo
    Schema::table('laboratories', function (Blueprint $table) {
        $table->boolean('offers_home_visit')->default(false); // Le labo propose-t-il ce service ?
        $table->decimal('home_visit_price', 8, 2)->nullable(); // Prix du déplacement (optionnel)
    });

    // Ajouter les détails à la demande d'analyse
    Schema::table('analysis_requests', function (Blueprint $table) {
        $table->boolean('is_home_visit')->default(false); // Est-ce une demande à domicile ?
        $table->string('home_visit_address')->nullable(); // Adresse spécifique (si différente du profil)
        $table->dateTime('home_visit_date')->nullable(); // Date/Heure souhaitée
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
