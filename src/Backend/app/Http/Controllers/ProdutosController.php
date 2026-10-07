<?php

namespace App\Http\Controllers;

use App\Models\Produto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProdutosController extends Controller
{

    // ===================================================================================================
    // CADASTRAR PRODUTO
    // ===================================================================================================
    public function store(Request $request)
    {

        $estagiario = $request->user()->nivel_acesso === 'estagiario';
        $professor = $request->user()->nivel_acesso === 'professor';

        if (!$estagiario && !$professor) {
            return response()->json([
                "message" => "Acesso negado"
            ], 403);
        }


        $productData = $request->validate([
            'categoria_id' => 'required|integer|exists:categorias,id',
            'nome' => 'required|string|unique:produtos,nome',
            'descricao' => 'required|string|max:255',
            'preco' => 'required|numeric|decimal:0,2|min:0',
            'estoque' => 'required|integer|min:0',
            'ativo' => 'required|boolean',
            'imagem' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048'
        ]);

        if ($request->hasFile('imagem')) {
            $file = $request->file('imagem');

            $nomeimg = time() . '-' . $file->hashName();

            $file->move(public_path('img/produtosImgs'), $nomeimg);

            $productData['imagem'] = 'img/produtosImgs/' . $nomeimg;
        }


        $newProduct = Produto::create($productData);

        return response()->json([
            "message" => "Produto criado com sucesso",
            "data" => $newProduct
        ], 201);
    }

    // ===================================================================================================
    // BUSCAR TODOS PRODUTOS
    // ===================================================================================================
    public function index()
    {
        $produtos = Produto::all();
        return response()->json([
            "message" => "Exibindo produtos",
            "data" => $produtos
        ], 200);
    }

    // ===================================================================================================
    // BUSCAR UM PRODUTO ESPECIFICO
    // ===================================================================================================
    public function show(int $id)
    {
        $produto = Produto::findOrFail($id);

        return response()->json([
            "message" => "Exibindo produto",
            "data" => $produto
        ], 200);
    }

    // ===================================================================================================
    // ATUALIZAR PRODUTO
    // ===================================================================================================
    public function update(Request $request, int $id)
    {
        $estagiario = $request->user()->nivel_acesso === 'estagiario';
        $professor = $request->user()->nivel_acesso === 'professor';

        if (!$estagiario && !$professor) {
            return response()->json([
                "message" => "Acesso negado"
            ], 403);
        }

        $produto = Produto::findOrFail($id);

        $dataAtualizados = $request->validate([
            'categoria_id' => 'integer|exists:categorias,id',
            'nome' => 'string|unique:produtos,nome,' . $id,
            'descricao' => 'string|max:255',
            'preco' => 'numeric|decimal:0,2|min:0',
            'estoque' => 'integer|min:0',
            'ativo' => 'boolean',
            'imagem' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048'
        ]);

        if ($request->hasFile('imagem')) {
            // 1. Apaga a imagem antiga se ela existir fisicamente na pasta public
            if ($produto->imagem && file_exists(public_path($produto->imagem))) {
                unlink(public_path($produto->imagem));
            }

            // 2. Processa e move a nova imagem
            $file = $request->file('imagem');
            $nomeimg = time() . '-' . $file->getClientOriginalName();
            $file->move(public_path('img/produtosImgs'), $nomeimg);

            // 3. Atualiza o caminho que irá para o banco de dados
            $dataAtualizados['imagem'] = 'img/produtosImgs/' . $nomeimg;
        }
        $produto->update($dataAtualizados);

        return response()->json([
            "message" => "Produto atualizado com sucesso",
            "data" => $produto
        ], 200);
    }


    // ===================================================================================================
    // DELETAR PRODUTO
    // ===================================================================================================
    public function destroy(Request $request, int $id)
    {
        $usuarioLogado = $request->user();

        $administrador = $usuarioLogado->nivel_acesso === "professor";

        if (!$administrador) {
            return response()->json([
                "message" => "Acesso não autorizado, apenas professores podem excluir produtos"
            ], 403); // acesso negado
        }

        $produto = Produto::findOrFail($id);

        if ($produto->imagem && file_exists(public_path($produto->imagem))) {
            unlink(public_path($produto->imagem));
        }   

        $produto->delete();

        return response()->json([
            "message" => "Produto excluído",
            "data" => $produto
        ], 200);
    }
}
