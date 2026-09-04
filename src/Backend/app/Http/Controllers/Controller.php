<?php

namespace App\Http\Controllers;

abstract class Controller
{   
// Ao sistema retornar os dados do usuario, ele retornará com a senha escondida.
    protected $hidden = [
        'senha'
    ];
}
