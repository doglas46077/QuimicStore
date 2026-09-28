<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable; // 1. Herança para autenticação
use Laravel\Sanctum\HasApiTokens;                       // 2. Trait para Tokens do Sanctum
use Illuminate\Notifications\Notifiable;
use Override;

class Usuario extends Authenticatable
{
    protected $table = 'usuarios';

    protected $fillable = [
        'nome',
        'email',
        'senha',
        'nivel_acesso'
    ];


    // Oculta o campo de senha em respostas JSON
    protected $hidden = [
        'senha'
    ];

    #[Override]
    public function getAuthPassword()
    {
        return $this->senha;
    }


    public function avaliacoes() {
        return $this->hasMany(Avaliacao::class, 'usuario_id');
        // Usuário pode fazer mais de uma avaliacao
    }

    public function pedidos() {
        return $this->hasMany(Pedido::class, 'usuario_id');
        // Usuario pode fazer mais de um pedido
    }

}
