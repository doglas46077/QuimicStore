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
        Schema::create('pagamentos', function (Blueprint $table) {
            $table->id('id_pagamento');
            $table->foreignId('id_venda')->unique()->constrained('vendas', 'id_venda')->onDelete('cascade');
            $table->enum('status_pagamento', ['pendente', 'confirmado', 'recusado'])->default('pendente');
            $table->string('comprovante', 255)->nullable();
            $table->dateTime('data_confirmacao')->nullable();
            $table->string('descricao', 255)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pagamentos');
    }
};
