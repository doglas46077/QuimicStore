<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

public function up(): void
{
    Schema::create('lista_esperas', function (Blueprint $table) {
        $table->id();
        $table->foreignId('usuario_id')->constrained('usuarios')->onDelete('cascade');
        $table->foreignId('produto_id')->constrained('produtos')->onDelete('cascade');
        $table->enum('status', ['aguardando', 'notificado'])->default('aguardando');
        $table->timestamps();

        // Evita que o mesmo usuário entre 2 vezes na fila do mesmo produto
        $table->unique(['usuario_id', 'produto_id']);
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lista_esperas');
    }
};
