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
        Schema::create('produtos', function (Blueprint $table) {
            $table->id('id_produto');
            $table->string('nome_produto', 120);
            $table->string('descricao', 500)->nullable();
            $table->string('imagem', 255)->nullable();
            $table->decimal('valor_produto', 10,2);
            $table->integer('quantidade_estoque')->default(0);
            $table->boolean('disponivel')->default(true);
            $table->integer('prazo_producao')->nullable();
            $table->foreignId('id_categorias')->nullable()->constrained('categorias', 'id_categoria');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('produtos');
    }
};
