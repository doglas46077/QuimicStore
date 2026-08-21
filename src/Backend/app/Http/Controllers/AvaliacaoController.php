<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Avaliacao;
use App\Http\Controllers\Controller;

class AvaliacaoController extends Controller
{
    //
    public function store(Request $request){

    $validatedDate = $request->validate([
        'id_produto' =>      'required|exists:produtos,id_produto',
        'id_comprador' =>    'required|exists:compradores,id_comprador',
        'nota' =>            'required|integer|min:1|max:5',
        'comentario' =>       'nullable|string|max:500',
        'status_moderacao' => 'nullable|in:pendente,aprovado,reprovado',
        'data_avaliacao' =>   'nullable|date',
    ]);

     $avaliacao = Avaliacao::create($validatedDate);

    return response()->json([
        'message' => 'Avaliação registrada com sucesso!',
        'avaliação' => $avaliacao
    ],201);
    }
}
