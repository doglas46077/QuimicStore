<?php

namespace App\Http\Controllers;

use App\Models\Produto;
use Illuminate\Http\Request;

class ProdutosController extends Controller
{

// ===================================================================================================
// CADASTRAR PRODUTO
// ===================================================================================================
    public function cadastrarProduto(Request $request) {
        $dadosProdutos = $request->validate([
            'categoria_id' => 'required|integer|exists:categorias,id',
            'nome' => 'required|string|unique:produtos,nome',
            'descricao' => 'required|string|max:255',
            'preco' => 'required|numeric|decimal:0,2|min:0',
            'estoque' => 'required|integer|min:0',
            'ativo' => 'required|boolean',
            'imagem' => 'required|string|max:2048'
        ]);

        $novoProduto = Produto::create($dadosProdutos);

        return response()->json([
            "mensagem" => "Produto criado com sucesso",
            "dados" => $novoProduto
        ], 201);
    }

// ===================================================================================================
// BUSCAR TODOS PRODUTOS
// ===================================================================================================
    public function buscarProdutos() {
        $produtos = Produto::all();
        return response()->json([
            "mensagem" => "Exibindo produtos",
            "dados" => $produtos
        ], 200);
    }

// ===================================================================================================
// BUSCAR UM PRODUTO ESPECIFICO
// ===================================================================================================
    public function buscarProduto(int $id) {
        $produto = Produto::findOrFail($id);

        return response()->json([
            "mensagem" => "Exibindo produto",
            "dados" => $produto
        ], 200);
    }

// ===================================================================================================
// ATUALIZAR PRODUTO
// ===================================================================================================
    public function update(Request $request, int $id) {
        $produto = Produto::findOrFail($id);
        
        $dadosAtualizados = $request->validate([
            'categoria_id' => 'integer|exists:categorias,id',
            'nome' => 'string|unique:produtos,nome,' . $id,
            'descricao' => 'string|max:255',
            'preco' => 'numeric|decimal:0,2|min:0',
            'estoque' => 'integer|min:0',
            'ativo' => 'boolean',
            'imagem' => 'string|max:2048'
            ]);
      
        $produto->update($dadosAtualizados);

        return response()->json([
            "mensagem" => "Produto atualizado com sucesso",
            "dados" => $produto
        ], 200);
    }


// ===================================================================================================
// DELETAR PRODUTO
// ===================================================================================================
    public function destroy(Request $request, int $id) {
        $usuarioLogado = $request->user();

        $administrador = $usuarioLogado->nivel_acesso === "professor";

        if(!$administrador) {
            return response()->json([
                "mensagem" => "Acesso não autorizado"
            ], 403); // acesso negado
        }

        $produto = Produto::findOrFail($id);

        $produto->delete();

        return response()->json([
            "mensagem" => "Produto exclúido",
            "dados" => $produto
        ], 200);
    }
}