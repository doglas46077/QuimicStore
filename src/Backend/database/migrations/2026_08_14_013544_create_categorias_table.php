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
        Schema::create('categorias', function (Blueprint $table) {
            $table->id('id_categoria');
            // Chave identificadora, auto_increment, primary key

            $table->string('nome', 80);
            // ->string: tipo do campo
            // nome: Nome do campo
            // 80: Quantidade de caractere do cmapo

            $table->foreignId('id_categoria_pai')->nullable()->constrained('categorias', 'id_categoria');
            // Aqui diz, vincule a chave estrangeira(foreign('id_categoria_pai')) vinculada(constrained) na tabela categorias no campo 'id_categoria'

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categorias');
    }
};
