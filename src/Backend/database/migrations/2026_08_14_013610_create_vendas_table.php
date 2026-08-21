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
        Schema::create('vendas', function (Blueprint $table) {
        $table->id('id_venda');
        $table->dateTime('data_venda')->useCurrent();
        $table->enum('forma_pagamento', ['pix', 'dinheiro']);
        $table->enum('status', ['processando', 'confirmado', 'aguardando_retirada', 'cancelado'])->default('processando');
        $table->dateTime('data_atualizacao_status')->nullable();
        $table->foreignId('id_comprador')->constrained('compradores', 'id_comprador');
        $table->foreignId('id_login_estagiario')->nullable()->constrained('logins', 'id_login');
        $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vendas');
    }
};
