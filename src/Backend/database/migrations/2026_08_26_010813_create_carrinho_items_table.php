<?php

use App\Models\Carrinho;
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
        Schema::create('carrinho_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('carrinho_id')->constrained('carrinhos')->onDelete('cascade');
            $table->foreignId('id_produto')->constrained('produtos', 'id_produto');
            $table->decimal('valor_unitario');
            $table->integer('quantidade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('carrinho_items');
    }
};
