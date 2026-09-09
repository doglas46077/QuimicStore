<?php

namespace App\Http\Controllers;

use App\Models\Pedido;
use Illuminate\Http\Request;

class PedidosController extends Controller
{
    public function pedido(Request $request) {
        $pedidoArmazenado = $request->validate([
            // array ('itens') que é uma requisição obrigatória e que tenha no mínimo 1 produto dentro do array de itens
            'itens' => 'required|array|min:1',
            // percorrer ('*') no array ('itens') pegando cada item(produto_id) dentro do array, verifica se realmente foi enviada, do tipo inteiro e realmente existe na tabela produtos
            'itens.*.produtos_id' => 'required|integer|exists:produtos,id'
        ]);
    }
}
