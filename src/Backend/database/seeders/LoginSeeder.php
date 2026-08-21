<?php

namespace Database\Seeders;


use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class LoginSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        // DB => Database chamada de Facade. Guarda todas as configurações de acesso do banco de dados
        // :: => Permite que eu acesse uma ação de uma classe sem precisar fazer uma cópia dela
        // table('logins') => Basicamente, o próprio seeder
        // DB::table('logins') => Olha exatamente para o banco de dados e encontra a tabela logins que o migration criou
        DB::table('logins')->insert([
            [
                'nome' => 'Professor',
                'cpf' => '11111111',
                'telefone' => '111111',
                'email' => 'professor@fiec.com',
                'senha' => Hash::make('senha123'),
                'tipo' => 'administrador',
            ],
            [
                'nome' => 'Estágiario',
                'cpf' => '222222',
                'telefone' => '222222',
                'email' => 'estagiario@fiec.com',
                'senha' => Hash::make('senha123'),
                'tipo' => 'estagiario',               
            ]
        ]);
    }
}
