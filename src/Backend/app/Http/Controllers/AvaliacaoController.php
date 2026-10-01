<?php

namespace App\Http\Controllers;

use App\Models\Avaliacao;
use App\Models\Produto;
use Illuminate\Http\Request;

class AvaliacaoController extends Controller
{
    public function store(Request $request, int $reqProdutoID) {
        $request->validate([
            "nota" => "required|integer|between:1,5",
            "comentario" => "string|nullable"
        ]);

        $userId = $request->user()->id;
        $produtoid = Produto::findOrFail($reqProdutoID);
        $nota = $request->input('nota');
        $comentario = $request->input('comentario');


        $avaliacao = Avaliacao::create([
            "produto_id" => $produtoid->id,
            "usuario_id" => $userId,
            "nota" => $nota,
            "comentario" => $comentario
        ]); 
        
        return response()->json([
            "message" => "Avaliação enviada",
            "data" => $avaliacao
        ], 201);
    }

    public function index() {
         $avaliacoes = Avaliacao::with('usuario');
        
         return response()->json([
            "message" => 'Comentarios buscado com sucesso',
            "data" => $avaliacoes
         ]);
    }
}
