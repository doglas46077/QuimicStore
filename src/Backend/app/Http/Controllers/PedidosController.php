<?php

namespace App\Http\Controllers;

use App\Models\Pedido;
use App\Models\Produto;
use App\Models\Pagamento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PedidosController extends Controller
{
    // 1. Método para criar novos pedidos
    public function criarPedido(Request $request) 
    {
        // Validação dos dados recebidos
        $pedidoArmazenado = $request->validate([
            'usuario_id' => 'required|integer|exists:usuarios,id',
            'metodo_pagamento' => 'required|in:pix,dinheiro',
            'itens' => 'required|array|min:1',
            'itens.*.produto_id' => 'required|integer|exists:produtos,id',
            'itens.*.quantidade' => 'required|integer|min:1'
        ]);

        // Checagem de estoque antes de abrir a transação
        foreach ($pedidoArmazenado['itens'] as $item) {
            $produto = Produto::find($item['produto_id']);

            if ($item['quantidade'] > $produto->estoque) {
                return response()->json([
                    'mensagem' => "Estoque insuficiente para o produto: {$produto->nome}"
                ], 400);
            }
        }

        // Transação do banco de dados
        DB::beginTransaction();

        try {
            // Cria o pedido inicial
            $pedido = Pedido::create([
                'usuario_id' => $pedidoArmazenado['usuario_id'],
                'status' => 'pendente',
                'valor_total' => 0,
            ]);

            $valorTotal = 0;

            // Processa cada item e abate estoque
            foreach ($pedidoArmazenado['itens'] as $item) {
                $produto = Produto::find($item['produto_id']);

                $produto->decrement('estoque', $item['quantidade']);

                $pedido->itens()->create([
                    'produto_id' => $produto->id,
                    'quantidade' => $item['quantidade'],
                    'preco_unitario_na_hora_da_compra' => $produto->preco
                ]);

                $valorTotal += $produto->preco * $item['quantidade'];
            }

            // Atualiza o valor total do pedido
            $pedido->update(['valor_total' => $valorTotal]);

            // Registra o pagamento
            Pagamento::create([
                'pedido_id' => $pedido->id,
                'metodo' => $pedidoArmazenado['metodo_pagamento'],
                'status' => 'pendente',
                'valor_pago' => $valorTotal
            ]);

            DB::commit();

            return response()->json([
                "mensagem" => 'Pedido realizado com sucesso!',
                "dados" => $pedido->load(['itens', 'pagamento'])
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                "mensagem" => 'Erro ao processar o pedido no banco de dados',
                "erro" => $e->getMessage()
            ], 500);
        }
    }

    // 2. Método para listar todos os pedidos de um usuário específico
    public function listarPedidosDoUsuario($usuario_id)
    {
        $pedidos = Pedido::with(['itens.produto', 'pagamento'])
            ->where('usuario_id', $usuario_id)
            ->orderBy('created_at', 'desc')
            ->get();

        if ($pedidos->isEmpty()) {
            return response()->json([
                'mensagem' => 'Nenhum pedido encontrado para este usuário.'
            ], 404);
        }

        return response()->json([
            'mensagem' => 'Pedidos recuperados com sucesso!',
            'dados' => $pedidos
        ], 200);
    }
}