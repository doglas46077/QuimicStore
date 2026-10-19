<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pagamentos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pedido_id')->constrained('pedidos')->onDelete('cascade');
            $table->enum('metodo', ['pix', 'dinheiro'])->default('pix');
            $table->enum('status', ['pendente', 'aprovado', 'cancelado'])->default('pendente');
            $table->decimal('valor_pago', 10, 2);
            $table->string('txid')->nullable()->unique(); // Adicionado nullable()
            $table->text('pix_copia_cola')->nullable();  // Adicionado nullable()
            $table->string('comprovante_path')->nullable();
            $table->timestamp('data_pagamento')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pagamentos');
    }
};
