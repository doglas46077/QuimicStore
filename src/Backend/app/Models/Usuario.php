<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Usuario extends Model
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


    public function avaliacoes() {
        return $this->hasMany(Avaliacao::class, 'usuario_id');
        // Usuário pode fazer mais de uma avaliacao
    }

    public function pedidos() {
        return $this->hasMany(Pedido::class, 'usuario_id');
        // Usuario pode fazer mais de um pedido
    }

}
