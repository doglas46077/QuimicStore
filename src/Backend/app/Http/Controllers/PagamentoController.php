<?php

namespace App\Http\Controllers;

use App\Models\Pagamento;
use Illuminate\Http\Request;

class PagamentoController extends Controller
{
    //
    public function store(Request $request){
        $validatedDate = $request->validate([
        'id_venda' =>          'required|integer|exists:vendas,id_venda|unique:pagamentos,id_venda',
        'status_pagamentos' => 'required|in:pendente,confirmado,recusado',
        'comprovante' =>       'nullable|string|max:255',
        'data_confirmacao' =>  'nullable|date',
        'descricao' =>         'nullable|string|max:250',
        ]);

        $pagamento = Pagamento::create($validatedDate);

        return response()->json([
            "mensagem" => "pagamento realizado com sucesso!",
            "pagamento" => $pagamento
        ],201);
    }
}
