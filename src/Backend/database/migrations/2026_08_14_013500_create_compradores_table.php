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
        Schema::create('compradores', function (Blueprint $table) {
            $table->id('id_comprador');
            // Coluna identificadora, auto_increment, primary key

            $table->string('nome', 120);
            // string: tipo da coluna
            // nome: 'nome da coluna'
            // 120: quantidade de caractere
            
            $table->string('matricula_layers', 50)->unique();
            // ->unique(): Coluna que nao pode ter valores iguais, restrito apenas a um dado
            

            $table->string('email', 150)->nullable();
            // ->nullable(): Campo nao obrigatorio

            $table->string('telefone', 15)->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('compradores');
    }
};
