<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Login extends Model
{
    // Diz ao php que, o ID da table nao se chama "ID" e sim "id_login"
    protected $primaryKey = 'id_login';



    // Sempre que o sistema retornar os dados do usuário, a senha vai ser escondida
    protected $hidden = [
        'senha',
    ];
}
