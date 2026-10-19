<?php

namespace Database\Seeders;

use App\Models\Categoria;
use App\Models\User;
use App\Models\Usuario;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
        
        \App\Models\Usuario::factory(20)->create();


        Usuario::create([
            'nome' => 'Professor',
            "email" => "professor@fiec.edu.br",
            "senha" => Hash::make('senha123'),
            "nivel_acesso" => 'professor'
        ]);

    $categorias = Categoria::factory()
    ->count(3)
    ->sequence(
        ['nome' => 'limpeza'],
        ['nome' => 'higiene'],
        ["nome" => "estética"]
    )
    ->create();

    // O produto será gerado após as 3 categorias gerando assim produtos apenas com elas 3
       \App\Models\Produto::factory(100)->create([
    'categoria_id' => fn () => $categorias->random()->id,
        ]);
    }
}
