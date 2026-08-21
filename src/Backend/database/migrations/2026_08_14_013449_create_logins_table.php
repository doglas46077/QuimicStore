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
        Schema::create('logins', function (Blueprint $table) {
            $table->id('id_login'); 
            // id: Auto increment primary key da nossa tabela login
            
            $table->string('nome', 120);
            // string: Tipo do dado
            // 120: Quantidade de caracteres

            $table->string('cpf', 11)->unique();
            // string: tipo do dado
            // cpf: nome do coluna
            // 11: quantidade de caractere
            // ->unique(): Diz que, o valor é unico, irá existir apenas um dado igual na tabela

            $table->string('telefone', 15)->nullable();
            // ->nullable(); diz que o valor pode ser nulo, ou seja, um valor nao obrigatorio

            $table->string('email', 150)->unique();
            $table->string('senha', 255);

            $table->enum('tipo', ['administrador', 'estagiario', 'cliente']);
            // ->enum: Cria como se fosse uma lista com opções fixas(válidas). Onde a coluna tipo só irá receber valores do tipo administrador e estagiário

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('logins');
    }
};
