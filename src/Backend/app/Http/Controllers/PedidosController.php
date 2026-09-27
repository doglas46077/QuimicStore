<?php

namespace App\Http\Controllers;

use App\Models\ItemPedido; // Corrigido para PascalCase (padrão Laravel)
use App\Models\Pedido;
use App\Models\Produto;
use App\Models\Pagamento; // Adicionado modelo de Pagamento
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Exception;

class PedidosController extends Controller
{
    // ======================================================================
    // CONTROLLER PEDIDOS DESENVOLVIDO POR DÔGLAS   
    // ======================================================================

    public function criarPedido(Request $request)
    {
        $pedidoArmazenado = $request->validate([
            'itens' => 'required|array|min:1',
            'itens.*.produto_id' => 'required|integer|exists:produtos,id',
            'itens.*.quantidade' => 'required|integer|min:1',
            'metodo_pagamento' => 'required|string' // Adicionado pois é utilizado no registro de pagamento
        ]);

        DB::beginTransaction();

        try {
            // Verifica o estoque de todos os itens antes de iniciar as inserções
            foreach ($pedidoArmazenado['itens'] as $item) {
                $produto = Produto::findOrFail($item['produto_id']);

                if ($item['quantidade'] > $produto->estoque) {
                    throw new Exception("Estoque insuficiente para o produto: {$produto->nome}");
                }
            }

            // Cria o pedido inicial com valor zero
            $pedido = Pedido::create([
                'usuario_id' => 1, // Idealmente seria auth()->id() em produção
                'status' => 'pendente',
                'valor_total' => 0,
            ]);

            $valorTotal = 0;

            // Processa cada item do pedido
            foreach ($pedidoArmazenado['itens'] as $item) {
                $produto = Produto::findOrFail($item['produto_id']);

                // Decrementa o estoque
                $produto->decrement('estoque', $item['quantidade']);

                // Insere na tabela de itens do pedido
                $pedido->itens()->create([
                    'produto_id' => $produto->id,
                    'quantidade' => $item['quantidade'],
                    'preco_unitario_na_hora_da_compra' => $produto->preco
                ]);

                // Soma ao valor total
                $valorTotal += ($produto->preco * $item['quantidade']);
            }

            // Atualiza o valor total real do pedido
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

        } catch (Exception $e) {
            DB::rollBack();

            return response()->json([
                "mensagem" => 'Erro ao processar o pedido no banco de dados',
                "erro" => $e->getMessage()
            ], 500);
        }
    }

    // =================================================================================================
    // Listar todos os pedidos de um usuário específico
    // =================================================================================================
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

    // =================================================================================================
    // Buscar todos os pedidos de todos os usuários
    // =================================================================================================
    public function buscarTodosPedidos()
    {
        $pedidos = Pedido::with('usuario', 'itens.produto')->get();

        return response()->json([
            "mensagem" => "Todos os pedidos de todos os usuários registrados ao sistema",
            "dados" => $pedidos
        ]);
    }

    // =================================================================================================
    // BUSCAR PEDIDO POR USUÁRIO 
    // =================================================================================================
    public function buscarPedidoPorUsuario(int $id)
    {
        $pedidos = Pedido::with('usuario', 'itens.produto')->where('usuario_id', $id)->get();

        if ($pedidos->isEmpty()) {
            return response()->json([
                "mensagem" => 'Usuário ainda não tem um pedido'
            ], 404);
        }

        return response()->json([
            "mensagem" => 'O usuario ' . $id . ' tem estes pedidos:',
            "dados" => $pedidos
        ]);
    }

    // =======================================================================================================
    // Atualizar pedido
    // =======================================================================================================
    public function update(Request $request, int $id)
    {
        $pedidoArmazenado = $request->validate([
            'itens' => 'required|array|min:1',
            'itens.*.produto_id' => 'required|integer|exists:produtos,id',
            'itens.*.quantidade' => 'required|integer|min:1'
        ]);

        DB::beginTransaction();
        try {
            foreach ($pedidoArmazenado['itens'] as $item) {
                $itemPedido = ItemPedido::where('pedido_id', $id)
                    ->where('produto_id', $item['produto_id'])
                    ->firstOrFail();

                $produto = Produto::findOrFail($itemPedido->produto_id);

                $quantidadeNova = $item['quantidade'];
                $quantidadeAntiga = $itemPedido->quantidade;

                $diferenca = $quantidadeNova - $quantidadeAntiga;
                
                // Trata a devolução ou remoção do estoque dependendo da diferença
                if ($diferenca > 0) {
                    if ($diferenca > $produto->estoque) {
                        throw new Exception("Estoque insuficiente para o produto: {$produto->nome}");
                    } else {
                        $produto->decrement('estoque', $diferenca);
                    }
                } elseif ($diferenca < 0) {
                    $produto->increment('estoque', abs($diferenca));
                }

                $itemPedido->update([
                    "quantidade" => $quantidadeNova
                ]);
            }

            $pedido = Pedido::findOrFail($id);

            // Recalcula o valor total da compra
            $valorTotal = ItemPedido::where('pedido_id', $id)
                ->get()
                ->sum(function ($item) {
                    return $item->quantidade * $item->produto->preco;
                });

            $pedido->update(['valor_total' => $valorTotal]);

            DB::commit();

            return response()->json([
                'mensagem' => 'Pedido atualizado com sucesso',
                'valor_total' => $valorTotal
            ], 200);

        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'mensagem' => 'Erro ao atualizar o pedido',
                'erro' => $e->getMessage()
            ], 500);
        }
    }

    // ====================================================================================
    // EXCLUIR UM PEDIDO
    // ====================================================================================
    public function destroy(int $id)
    {
        DB::beginTransaction();
        try {
            $pedido = Pedido::findOrFail($id);

            // Devolve as quantidades ao estoque antes de deletar
            foreach ($pedido->itens as $item) {
                $produto = Produto::findOrFail($item->produto_id);
                $produto->increment('estoque', $item->quantidade);
            }

            // Exclui os itens e depois o pedido
            $pedido->itens()->delete();
            $pedido->delete();

            DB::commit();

            return response()->json([
                'mensagem' => 'Pedido excluído e estoque restaurado com sucesso'
            ], 200);

        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'mensagem' => 'Erro ao excluir o pedido',
                'erro' => $e->getMessage()
            ], 500);
        }
    }
}