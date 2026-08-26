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
        Schema::create('avaliacoes', function (Blueprint $table) {
            $table->id('id_avaliacao');
            $table->foreignId('id_produto')->constrained('produtos', 'id_produto')->onDelete('cascade');
            $table->foreignId('id_login')->constrained('logins', 'id_login')->onDelete('cascade');
            $table->tinyInteger('nota');
            $table->string('comentario', 500)->nullable();
            $table->enum('status_moderacao', ['pendente', 'aprovado', 'reprovado'])->default('pendente');
            $table->dateTime('data_avaliacao')->useCurrent();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('avaliacoes');
    }
};
