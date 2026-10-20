<?php

namespace Database\Seeders;

use App\Models\Categoria;
use App\Models\Produto;
use Illuminate\Database\Seeder;

class ProdutoSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Cria ou recupera as categorias principais
        $limpeza  = Categoria::firstOrCreate(['nome' => 'limpeza']);
        $higiene  = Categoria::firstOrCreate(['nome' => 'higiene']);
        $estetica = Categoria::firstOrCreate(['nome' => 'estética']);

        // 2. Lista completa com os produtos identificados nas imagens do PDF
        $produtos = [
            // --- Categoria: LIMPEZA ---
            [
                'categoria_id' => $limpeza->id,
                'nome' => 'Multiuso Algas FIEC 500ml',
                'descricao' => 'Limpador multiuso com fragrância de algas para superfícies diversas.',
                'preco' => 6.50,
                'estoque' => 45,
                'ativo' => true,
                'imagem' => 'img/produtosImgs/produto-verde.png',
            ],
            [
                'categoria_id' => $limpeza->id,
                'nome' => 'Detergente Limão FIEC 500ml',
                'descricao' => 'Detergente líquido concentrado com essência e aroma de limão.',
                'preco' => 3.80,
                'estoque' => 80,
                'ativo' => true,
                'imagem' => 'img/produtosImgs/produto-azul.png',
            ],
            [
                'categoria_id' => $limpeza->id,
                'nome' => 'Detergente Neutro 500ml',
                'descricao' => 'Detergente neutro suave para lavagem de louças e utensílios.',
                'preco' => 3.50,
                'estoque' => 90,
                'ativo' => true,
                'imagem' => 'img/produtosImgs/produto-verde.png',
            ],
            [
                'categoria_id' => $limpeza->id,
                'nome' => 'Detergente Laranja FIEC 500ml',
                'descricao' => 'Detergente líquido concentrado com fragrância refrescante de laranja.',
                'preco' => 3.80,
                'estoque' => 60,
                'ativo' => true,
                'imagem' => 'img/produtosImgs/produto-verde.png',
            ],
            [
                'categoria_id' => $limpeza->id,
                'nome' => 'Detergente Coco FIEC 500ml',
                'descricao' => 'Detergente líquido com toque e aroma natural de coco.',
                'preco' => 3.90,
                'estoque' => 70,
                'ativo' => true,
                'imagem' => 'img/produtosImgs/produto-verde.png',
            ],
            [
                'categoria_id' => $limpeza->id,
                'nome' => 'Detergente Laranja FIEC 5L',
                'descricao' => 'Galão industrial de 5 litros de detergente concentrado de laranja.',
                'preco' => 28.90,
                'estoque' => 25,
                'ativo' => true,
                'imagem' => 'img/produtosImgs/produto-verde.png',
            ],
            [
                'categoria_id' => $limpeza->id,
                'nome' => 'Desinfetante e Limpador Lavanda FIEC 5L',
                'descricao' => 'Desinfetante para uso geral com fragrância duradoura de lavanda.',
                'preco' => 32.00,
                'estoque' => 30,
                'ativo' => true,
                'imagem' => 'img/produtosImgs/produto-verde.png',
            ],
            [
                'categoria_id' => $limpeza->id,
                'nome' => 'Amaciante de Roupas FIEC 5L',
                'descricao' => 'Amaciante perfumado que restaura as fibras de todos os tipos de tecidos.',
                'preco' => 35.50,
                'estoque' => 20,
                'ativo' => true,
                'imagem' => 'img/produtosImgs/produto-verde.png',
            ],
            [
                'categoria_id' => $limpeza->id,
                'nome' => 'Água para Lençóis Bambo MM FIEC 500ml',
                'descricao' => 'Aromatizador e água para lençóis proporcionando suavidade e conforto.',
                'preco' => 18.00,
                'estoque' => 40,
                'ativo' => true,
                'imagem' => 'img/produtosImgs/produto-verde.png',
            ],
            [
                'categoria_id' => $limpeza->id,
                'nome' => 'Água para Lençóis Garden FIEC 500ml',
                'descricao' => 'Spray perfumado Garden para tecidos, roupas de cama e lençóis.',
                'preco' => 18.00,
                'estoque' => 35,
                'ativo' => true,
                'imagem' => 'img/produtosImgs/produto-verde.png',
            ],

            // --- Categoria: HIGIENE ---
            [
                'categoria_id' => $higiene->id,
                'nome' => 'Sabonete Líquido FIEC 500ml',
                'descricao' => 'Sabonete líquido para mãos e corpo com válvula pump prática.',
                'preco' => 12.50,
                'estoque' => 50,
                'ativo' => true,
                'imagem' => 'img/produtosImgs/produto-verde.png',
            ],
            [
                'categoria_id' => $higiene->id,
                'nome' => 'Sabonete Líquido Alfazema FIEC 2L',
                'descricao' => 'Refil de sabonete líquido para mãos e rosto com pH adequado para a pele.',
                'preco' => 24.90,
                'estoque' => 30,
                'ativo' => true,
                'imagem' => 'img/produtosImgs/produto-verde.png',
            ],
            [
                'categoria_id' => $higiene->id,
                'nome' => 'Sabonete Líquido Erva Doce FIEC 2L',
                'descricao' => 'Sabonete líquido de erva doce suave para higienização diária.',
                'preco' => 24.90,
                'estoque' => 30,
                'ativo' => true,
                'imagem' => 'img/produtosImgs/produto-verde.png',
            ],
            [
                'categoria_id' => $higiene->id,
                'nome' => 'Sabonete Líquido Mirra FIEC 2L',
                'descricao' => 'Sabonete líquido com aroma clássico de mirra para higienização suave.',
                'preco' => 24.90,
                'estoque' => 25,
                'ativo' => true,
                'imagem' => 'img/produtosImgs/produto-verde.png',
            ],
            [
                'categoria_id' => $higiene->id,
                'nome' => 'Álcool Gel Antisséptico Frutas Vermelhas 30g',
                'descricao' => 'Álcool em gel antisséptico para bolsas de 30g com fragrância de frutas vermelhas.',
                'preco' => 5.00,
                'estoque' => 100,
                'ativo' => true,
                'imagem' => 'img/produtosImgs/produto-verde.png',
            ],
            [
                'categoria_id' => $higiene->id,
                'nome' => 'Álcool Gel Antisséptico Maçã Verde 30g',
                'descricao' => 'Álcool em gel portátil para higienização das mãos aroma maçã verde.',
                'preco' => 5.00,
                'estoque' => 100,
                'ativo' => true,
                'imagem' => 'img/produtosImgs/produto-verde.png',
            ],

            // --- Categoria: ESTÉTICA ---
            [
                'categoria_id' => $estetica->id,
                'nome' => 'Creme para as Mãos Cereja & Avelã FIEC 40g',
                'descricao' => 'Creme hidratante para as mãos com fragrância de cereja e avelã.',
                'preco' => 14.90,
                'estoque' => 45,
                'ativo' => true,
                'imagem' => 'img/produtosImgs/produto-verde.png',
            ],
            [
                'categoria_id' => $estetica->id,
                'nome' => 'Creme Hidratante para as Mãos Avelã & Mel FIEC 60g',
                'descricao' => 'Creme hidratante protetor para as mãos com extratos de avelã e mel.',
                'preco' => 16.50,
                'estoque' => 50,
                'ativo' => true,
                'imagem' => 'img/produtosImgs/produto-verde.png',
            ],
            [
                'categoria_id' => $estetica->id,
                'nome' => 'Mascára Detox Castanha do Pará 60ml',
                'descricao' => 'Máscara capilar de tratamento com óleo vegetal de castanha do Pará e selênio.',
                'preco' => 22.90,
                'estoque' => 35,
                'ativo' => true,
                'imagem' => 'img/produtosImgs/produto-verde.png',
            ],
            [
                'categoria_id' => $estetica->id,
                'nome' => 'Loção Repelente de Insetos Hidratante FIEC 120g',
                'descricao' => 'Loção repelente dermatologicamente testada com Icaridina e FPS 30.',
                'preco' => 19.90,
                'estoque' => 60,
                'ativo' => true,
                'imagem' => 'img/produtosImgs/produto-verde.png',
            ],
            [
                'categoria_id' => $estetica->id,
                'nome' => 'Repelente Spray Refrescante Citronela FIEC 120ml',
                'descricao' => 'Repelente em spray com ação refrescante e essência natural de citronela.',
                'preco' => 18.50,
                'estoque' => 55,
                'ativo' => true,
                'imagem' => 'img/produtosImgs/produto-verde.png',
            ],
            [
                'categoria_id' => $estetica->id,
                'nome' => 'Creme de Arnica para Massagem FIEC 120g',
                'descricao' => 'Creme hipoalergênico para massagem muscular, lombar e contusões.',
                'preco' => 21.00,
                'estoque' => 40,
                'ativo' => true,
                'imagem' => 'img/produtosImgs/produto-verde.png',
            ],
        ];

        // 3. Cadastra ou atualiza os produtos sem duplicar
        foreach ($produtos as $produtoData) {
            Produto::firstOrCreate(
                ['nome' => $produtoData['nome']],
                $produtoData
            );
        }
    }
}