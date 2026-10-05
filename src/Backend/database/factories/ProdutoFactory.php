<?php

namespace Database\Factories;

use App\Models\Produto;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Produto>
 */
class ProdutoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "categoria_id" => \App\Models\Categoria::factory(),
            "nome" => fake()->words(2, true),
            "descricao" => fake()->sentence(),
            "preco" => fake()->randomFloat(2, 10, 500),
            "estoque" => fake()->numberBetween(1, 100),
            "ativo" => fake()->boolean(),
            "imagem"=> fake()->imageUrl()
        ];
    }
}
