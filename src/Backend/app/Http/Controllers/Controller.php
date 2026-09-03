<?php

namespace App\Http\Controllers;

abstract class Controller
{   

    // protected => É do casa dos 3, private, public, protected. Onde a classe mãe("model") pode acessar, mas arquivos de fora não, como se fosse um intermediador

    // Força o nome exato da tabela la no seeder, para o laravel fazer a "magica" de indentificar pelo plural
    protected $table = 'logins';

    // Ao sistema retornar os dados do usuario, ele retornará com a senha escondida.
    protected $hidden = [
        'senha'
    ];
}
