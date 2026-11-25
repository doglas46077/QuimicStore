<?php

namespace Database\Seeders;

use App\Models\Categoria;
use App\Models\Produto;
use Illuminate\Database\Seeder;

class ProdutoSeeder extends Seeder
{
    private const PASTA_IMAGENS = 'img/produtosImgs/';

    public function run(): void
    {
        // 1. Cria ou recupera as categorias principais
        $limpeza  = Categoria::firstOrCreate(['nome' => 'Limpeza']);
        $higiene  = Categoria::firstOrCreate(['nome' => 'Higiene']);
        $estetica = Categoria::firstOrCreate(['nome' => 'Estética']);

        // 2. Produtos (formato idêntico ao que o ProdutosController grava)
        $produtos = [
            // --- Categoria: LIMPEZA ---
            [
                'categoria_id' => $limpeza->id,
                'nome'         => 'Detergente Neutro 500ml',
                'descricao'    => 'Detergente neutro suave para lavagem de louças e utensílios.',
                'preco'        => 3.50,
                'estoque'      => 90,
                'imagem'       => 'detergente-neutro-500ml.jpg',
            ],
            [
                'categoria_id' => $limpeza->id,
                'nome'         => 'Detergente Laranja FIEC 500ml',
                'descricao'    => 'Detergente líquido concentrado com fragrância refrescante de laranja.',
                'preco'        => 3.80,
                'estoque'      => 60,
                'imagem'       => 'detergente-laranja-500ml.jpg',
            ],
            [
                'categoria_id' => $limpeza->id,
                'nome'         => 'Detergente Coco FIEC 500ml',
                'descricao'    => 'Detergente líquido com toque e aroma natural de coco.',
                'preco'        => 3.90,
                'estoque'      => 70,
                'imagem'       => 'detergente-coco-500ml.jpg',
            ],
            [
                'categoria_id' => $limpeza->id,
                'nome'         => 'Detergente Laranja FIEC 5L',
                'descricao'    => 'Galão industrial de 5 litros de detergente concentrado de laranja.',
                'preco'        => 28.90,
                'estoque'      => 25,
                'imagem'       => 'detergente-laranja-5l.jpg',
            ],
            [
                'categoria_id' => $limpeza->id,
                'nome'         => 'Desinfetante e Limpador Lavanda FIEC 5L',
                'descricao'    => 'Desinfetante para uso geral com fragrância duradoura de lavanda.',
                'preco'        => 32.00,
                'estoque'      => 30,
                'imagem'       => 'desinfetante-lavanda-5l.jpg',
            ],
            [
                'categoria_id' => $limpeza->id,
                'nome'         => 'Amaciante de Roupas FIEC 5L',
                'descricao'    => 'Amaciante perfumado que restaura as fibras de todos os tipos de tecidos.',
                'preco'        => 35.50,
                'estoque'      => 20,
                'imagem'       => 'amaciante-roupas-5l.jpg',
            ],
            [
                'categoria_id' => $limpeza->id,
                'nome'         => 'Água para Lençóis Bambo MM FIEC 500ml',
                'descricao'    => 'Aromatizador e água para lençóis proporcionando suavidade e conforto.',
                'preco'        => 18.00,
                'estoque'      => 40,
                'imagem'       => 'agua-lencois-bambo-mm-500ml.jpg',
            ],
            [
                'categoria_id' => $limpeza->id,
                'nome'         => 'Água para Lençóis Garden FIEC 500ml',
                'descricao'    => 'Spray perfumado Garden para tecidos, roupas de cama e lençóis.',
                'preco'        => 18.00,
                'estoque'      => 35,
                'imagem'       => 'agua-lencois-garden-500ml.jpg',
            ],

            // --- Categoria: HIGIENE ---
            [
                'categoria_id' => $higiene->id,
                'nome'         => 'Sabonete Líquido FIEC 500ml',
                'descricao'    => 'Sabonete líquido para mãos e corpo com válvula pump prática.',
                'preco'        => 12.50,
                'estoque'      => 50,
                'imagem'       => 'sabonete-liquido-500ml.jpg',
            ],
            [
                'categoria_id' => $higiene->id,
                'nome'         => 'Sabonete Líquido Alfazema FIEC 2L',
                'descricao'    => 'Refil de sabonete líquido para mãos e rosto com pH adequado para a pele.',
                'preco'        => 24.90,
                'estoque'      => 30,
                'imagem'       => 'sabonete-liquido-alfazema-2l.jpg',
            ],
            [
                'categoria_id' => $higiene->id,
                'nome'         => 'Sabonete Líquido Erva Doce FIEC 2L',
                'descricao'    => 'Sabonete líquido de erva doce suave para higienização diária.',
                'preco'        => 24.90,
                'estoque'      => 30,
                'imagem'       => 'sabonete-liquido-erva-doce-2l.jpg',
            ],
            [
                'categoria_id' => $higiene->id,
                'nome'         => 'Sabonete Líquido Mirra FIEC 2L',
                'descricao'    => 'Sabonete líquido com aroma clássico de mirra para higienização suave.',
                'preco'        => 24.90,
                'estoque'      => 25,
                'imagem'       => 'sabonete-liquido-mirra-2l.jpg',
            ],
            [
                'categoria_id' => $higiene->id,
                'nome'         => 'Álcool Gel Antisséptico Frutas Vermelhas 30g',
                'descricao'    => 'Álcool em gel antisséptico para bolsas de 30g com fragrância de frutas vermelhas.',
                'preco'        => 5.00,
                'estoque'      => 100,
                'imagem'       => 'alcool-gel-frutas-vermelhas-30g.jpg',
            ],
            [
                'categoria_id' => $higiene->id,
                'nome'         => 'Álcool Gel Antisséptico Maçã Verde 30g',
                'descricao'    => 'Álcool em gel portátil para higienização das mãos aroma maçã verde.',
                'preco'        => 5.00,
                'estoque'      => 100,
                'imagem'       => 'alcool-gel-maca-verde-30g.jpg',
            ],

            // --- Categoria: ESTÉTICA ---
            [
                'categoria_id' => $estetica->id,
                'nome'         => 'Creme para as Mãos Cereja & Avelã FIEC 40g',
                'descricao'    => 'Creme hidratante para as mãos com fragrância de cereja e avelã.',
                'preco'        => 14.90,
                'estoque'      => 45,
                'imagem'       => 'creme-maos-cereja-avela-40g.jpg',
            ],
            [
                'categoria_id' => $estetica->id,
                'nome'         => 'Creme Hidratante para as Mãos Avelã & Mel FIEC 60g',
                'descricao'    => 'Creme hidratante protetor para as mãos com extratos de avelã e mel.',
                'preco'        => 16.50,
                'estoque'      => 50,
                'imagem'       => 'creme-maos-avela-mel-60g.jpg',
            ],
            [
                'categoria_id' => $estetica->id,
                'nome'         => 'Máscara Detox Castanha do Pará 60ml',
                'descricao'    => 'Máscara capilar de tratamento com óleo vegetal de castanha do Pará e selênio.',
                'preco'        => 22.90,
                'estoque'      => 35,
                'imagem'       => 'mascara-detox-castanha-do-para-60ml.jpg',
            ],
            [
                'categoria_id' => $estetica->id,
                'nome'         => 'Loção Repelente de Insetos Hidratante FIEC 120g',
                'descricao'    => 'Loção repelente dermatologicamente testada com Icaridina e FPS 30.',
                'preco'        => 19.90,
                'estoque'      => 60,
                'imagem'       => 'locao-repelente-120g.jpg',
            ],
            [
                'categoria_id' => $estetica->id,
                'nome'         => 'Repelente Spray Refrescante Citronela FIEC 120ml',
                'descricao'    => 'Repelente em spray com ação refrescante e essência natural de citronela.',
                'preco'        => 18.50,
                'estoque'      => 55,
                'imagem'       => 'repelente-spray-citronela-120ml.jpg',
            ],
            [
                'categoria_id' => $estetica->id,
                'nome'         => 'Creme de Arnica para Massagem FIEC 120g',
                'descricao'    => 'Creme hipoalergênico para massagem muscular, lombar e contusões.',
                'preco'        => 21.00,
                'estoque'      => 40,
                'imagem'       => 'creme-arnica-massagem-120g.jpg',
            ],
        ];

        // 3. Cadastra os produtos sem duplicar (chave: nome, que é unique no controller)
        foreach ($produtos as $dados) {
            $imagem = $dados['imagem'];
            unset($dados['imagem']);

            Produto::firstOrCreate(
                ['nome' => $dados['nome']],
                $dados + [
                    'tempo_fabricacao' => null,
                    'ativo'            => true,
                    // o controller sempre grava 'imagens' como ARRAY de caminhos
                    'imagens'          => [self::PASTA_IMAGENS . $imagem],
                ]
            );
        }
    }
}