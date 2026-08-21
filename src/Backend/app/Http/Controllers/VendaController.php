<?php

namespace App\Http\Controllers;

use App\Models\Venda;
use Illuminate\Contracts\Support\ValidatedData;
use Illuminate\Http\Request;

class VendaController extends Controller
{
    //
    public function store(Request $request){
        $ValidatedData = $request->validate([
            'data_venda' =>              'required|date',
            'forma_pagamento' =>         'required|in:pix,dinheiro',
            'status' =>                  'required|in:processando,confirmado,aguardando_retirada,cancelado,processando',
            'data_atualizacao_status' => 'nullable|date',
            'id_comprador' =>            'required|integer|exists:compradores,id_comprador',
            'id_login_estagiario' =>     'nullable|integer|exists:logins,id_login', 
        ]);

        $venda =Venda::create($ValidatedData);

        return response()->json([
            "mensagem" => "venda realizada com sucesso",
            "venda" => $venda
        ],201);
    }
}
