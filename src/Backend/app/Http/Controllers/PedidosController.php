<?php

namespace App\Http\Controllers;

use App\Models\ItemPedido;
use App\Models\Pedido;
use App\Models\Produto;
use App\Models\Pagamento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Exception;

class PedidosController extends Controller
{

    public function store(Request $request)
    {

        $userAutorizado = $request->user()->nivel_acesso;

        if ($userAutorizado !== 'professor' && $userAutorizado !== 'estagiario') {
            return response()->json([
                "message" => 'Acesso restrito'
            ], 403);
        }

        $pedidoArmazenado = $request->validate([
            'itens' => 'required|array|min:1',
            'itens.*.produto_id' => 'required|integer|exists:produtos,id',
            'itens.*.quantidade' => 'required|integer|min:1',
            'metodo_pagamento' => 'required|string'
        ]);

        DB::beginTransaction();

        try {
            $pedido = Pedido::create([
                'usuario_id' => $request->user()->id,
                'status' => 'pendente',
                'valor_total' => 0,
            ]);

            $valorTotal = 0;

            foreach ($pedidoArmazenado['itens'] as $item) {
                $produto = Produto::findOrFail($item['produto_id']);

                if ($item['quantidade'] > $produto->estoque) {
                    throw new Exception("Estoque insuficiente para o produto: {$produto->nome}");
                }

                $produto->decrement('estoque', $item['quantidade']);

                $pedido->itens()->create([
                    'produto_id' => $produto->id,
                    'quantidade' => $item['quantidade'],
                    'preco_unitario_na_hora_da_compra' => $produto->preco
                ]);

                $valorTotal += ($produto->preco * $item['quantidade']);
            }

            $pedido->update(['valor_total' => $valorTotal]);

            Pagamento::create([
                'pedido_id' => $pedido->id,
                'metodo' => $pedidoArmazenado['metodo_pagamento'],
                'status' => 'pendente',
                'valor_pago' => $valorTotal
            ]);

            DB::commit();

            return response()->json([
                "message" => 'Pedido realizado com sucesso!',
                "dados" => $pedido->load(['itens', 'pagamento'])
            ], 201);
        } catch (Exception $e) {
            DB::rollBack();

            return response()->json([
                "message" => 'Erro ao processar o pedido no banco de dados',
                "erro" => $e->getMessage()
            ], 500);
        }
    }

    public function show(Request $request, int $usuario_id)
    {
        $usuarioLogado = $request->user();
        $donoDaConta = $usuarioLogado->id === $usuario_id;
        $temPermissao = $usuarioLogado->nivel_acesso === 'professor' ||  $usuarioLogado->nivel_acesso === 'estagiario';

        if (!$donoDaConta && !$temPermissao) {
            return response()->json([
                "message" => "Acesso restrito"
            ], 403);
        }

        $pedidos = Pedido::with(['itens.produto', 'pagamento'])
            ->where('usuario_id', $usuario_id)
            ->orderBy('created_at', 'desc')
            ->get();

        if ($pedidos->isEmpty()) {
            return response()->json([
                'message' => 'Nenhum pedido encontrado para este usuário.'
            ], 404);
        }

        return response()->json([
            'message' => 'Pedidos recuperados com sucesso!',
            'dados' => $pedidos
        ], 200);
    }

    public function index(Request $request)
    {
        $userAutorizado = $request->user()->nivel_acesso;

        if ($userAutorizado !== 'professor' && $userAutorizado !== 'estagiario') {
            return response()->json([
                "message" => 'Acesso restrito'
            ], 403);
        }

        $pedidos = Pedido::with('usuario', 'itens.produto')->get();

        return response()->json([
            "message" => "Todos os pedidos de todos os usuários registrados ao sistema",
            "dados" => $pedidos
        ]);
    }

    public function update(Request $request, int $id)
    {
        $userAutorizado = $request->user()->nivel_acesso;

        if ($userAutorizado !== 'professor' && $userAutorizado !== 'estagiario') {
            return response()->json([
                "message" => 'Acesso restrito'
            ], 403);
        }

        $pedidoArmazenado = $request->validate([
            'itens' => 'required|array|min:1',
            'itens.*.produto_id' => 'required|integer|exists:produtos,id',
            'itens.*.quantidade' => 'required|integer|min:1'
        ]);

        DB::beginTransaction();

        try {
            $pedido = Pedido::findOrFail($id);

            foreach ($pedidoArmazenado['itens'] as $item) {
                $produto = Produto::findOrFail($item['produto_id']);

                // Busca o item já existente ou cria um novo para o pedido
                $itemPedido = ItemPedido::firstOrNew([
                    'pedido_id' => $id,
                    'produto_id' => $item['produto_id']
                ]);

                $quantidadeAntiga = $itemPedido->exists ? $itemPedido->quantidade : 0;
                $quantidadeNova = $item['quantidade'];
                $diferenca = $quantidadeNova - $quantidadeAntiga;

                if ($diferenca > 0) {
                    if ($diferenca > $produto->estoque) {
                        throw new Exception("Estoque insuficiente para o produto: {$produto->nome}");
                    }
                    $produto->decrement('estoque', $diferenca);
                } elseif ($diferenca < 0) {
                    $produto->increment('estoque', abs($diferenca));
                }

                $itemPedido->quantidade = $quantidadeNova;

                // Se for um item novo no pedido, grava o preço atual
                if (!$itemPedido->exists) {
                    $itemPedido->preco_unitario_na_hora_da_compra = $produto->preco;
                }

                $itemPedido->save();
            }

            // Recalcula o total usando o preco_unitario_na_hora_da_compra
            $valorTotal = ItemPedido::where('pedido_id', $id)
                ->get()
                ->sum(function ($item) {
                    return $item->quantidade * $item->preco_unitario_na_hora_da_compra;
                });

            $pedido->update(['valor_total' => $valorTotal]);

            DB::commit();

            return response()->json([
                'message' => 'Pedido atualizado com sucesso',
                'valor_total' => $valorTotal
            ], 200);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erro ao atualizar o pedido',
            ], 500);
        }
    }

    public function destroy(Request $request, int $id)
    {
        $userAutorizado = $request->user()->nivel_acesso;

        if ($userAutorizado !== 'professor' && $userAutorizado !== 'estagiario') {
            return response()->json([
                "message" => 'Acesso restrito'
            ], 403);
        }

        DB::beginTransaction();
        try {
            $pedido = Pedido::findOrFail($id);

            foreach ($pedido->itens as $item) {
                $produto = Produto::findOrFail($item->produto_id);
                $produto->increment('estoque', $item->quantidade);
            }

            $pedido->itens()->delete();
            $pedido->delete();

            DB::commit();

            return response()->json([
                'message' => 'Pedido excluído e estoque restaurado com sucesso'
            ], 200);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erro ao excluir o pedido',
            ], 500);
        }
    }
}
