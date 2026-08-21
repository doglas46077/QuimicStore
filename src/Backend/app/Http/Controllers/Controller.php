<?php

namespace App\Http\Controllers;

abstract class Controller
{   

    // protected => É do casa dos 3, private, public, protected. Onde a classe mãe("model") pode acessar, mas arquivos de fora não, como se fosse um intermediador

    // Força o nome exato da tabela la no seeder, para o laravel fazer a "magica" de indentificar pelo plural
    protected $table = 'logins';

    // Adiciona as configurações que, a chave primaria que eu coloquei no seeder como id_login, nao se chama "ID (Padrão que o laravel acha que é) e sim, que se chama 'id_login' igual ao que eu coloquei no seeder"
    protected $primaryKey = 'id_login';



    // Ao sistema retornar os dados do usuario, ele retornará com a senha escondida.
    protected $hidden = [
        'senha'
    ];
}
