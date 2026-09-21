<?php

namespace App\Http\Controllers;

use App\Models\Pedido;
use App\Models\Produto;
use App\Models\Pagamento; // Importado
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB; // Importado para controlar as transações

class PedidosController extends Controller
{
    public function criarPedido(Request $request) {
        
        // 1. Validação (VALIDAÇÃO MANTIDA + Adicionado método de pagamento e usuario_id)
        $pedidoArmazenado =$request->validate([
            'usuario_id' => 'required|integer|exists:usuarios,id',
            'metodo_pagamento' => 'required|in:pix,dinheiro',
            'itens' => 'required|array|min:1',
            'itens.*.produto_id' => 'required|integer|exists:produtos,id',
            'itens.*.quantidade' => 'required|integer|min:1'
        ]);

        // 2. Checagem de Estoque (MANTIDO, mas com resposta HTTP 400 amigável)
        foreach ($pedidoArmazenado['itens'] as$item) {
            $produto = Produto::find($item['produto_id']);

            if ($item['quantidade'] >$produto->estoque) {
                return response()->json([
                    'mensagem' => "Estoque insuficiente para o produto: {$produto->nome}"
                ], 400);
            }
        }

        // INÍCIO DA TRANSAÇÃO (Garante integridade de todas as tabelas)
        DB::beginTransaction();

        try {
            // 3. Criar o pedido inicial (MANTIDO)
            $pedido = Pedido::create([
                'usuario_id' => $pedidoArmazenado['usuario_id'], // Usando o id enviado na requisição
                'status' => 'pendente',
                'valor_total' => 0,
            ]);

            $valorTotal = 0;

            // 4. Processar itens, abater estoque e vincular ao pedido (MANTIDO)
            foreach($pedidoArmazenado['itens'] as$item) {
                $produto = Produto::find($item['produto_id']);

                // Decrementa o estoque
                $produto->decrement('estoque',$item['quantidade']);

                // Adiciona item do pedido
                $pedido->itens()->create([
                    'produto_id' => $produto->id,
                    'quantidade' => $item['quantidade'],
                    'preco_unitario_na_hora_da_compra' => $produto->preco
                ]);

                // Acumula valor total
                $valorTotal += $produto->preco * $item['quantidade'];
            }

            // 5. Atualiza o valor total no pedido (MANTIDO)
            $pedido->update(['valor_total' =>$valorTotal]);

            // 6. ADICIONADO: Registra o pagamento na tabela `pagamentos`
            Pagamento::create([
                'pedido_id' => $pedido->id,
                'metodo' => $pedidoArmazenado['metodo_pagamento'],
                'status' => 'pendente',
                'valor_pago' => $valorTotal
            ]);

            // Confirma todas as gravações no banco
            DB::commit();

            return response()->json([
                "mensagem" => 'Pedido realizado com sucesso!',
                "dados" => $pedido->load(['itens', 'pagamento'])
            ], 201);

        } catch (\Exception $e) {
            // Se algo der errado no meio do caminho, desfaz tudo no banco
            DB::rollBack();

            return response()->json([
                "mensagem" => 'Erro ao processar o pedido no banco de dados',
                "erro" => $e->getMessage()
            ], 500);
        }
    }
}