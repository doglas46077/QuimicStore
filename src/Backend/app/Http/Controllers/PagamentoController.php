<?php

namespace App\Http\Controllers;

use App\Models\Pagamento;
use App\Services\PixService;
use Illuminate\Http\Request;

class PagamentoController extends Controller
{
    public function gerarPix(Request $request)
    {
        $request->validate([
            'pedido_id' => 'required|exists:pedidos,id',
            'valor_pago' => 'required|numeric|min:0.01',
        ]);

        $valor = (float) $request->input('valor_pago');
        $pedidoId = $request->input('pedido_id');

        $txId = 'QX' . time() . rand(100, 999);

        $pixService = new PixService();
        $payloadPix = $pixService->gerarPayload($valor, $txId);
        $qrCodeBase64 = $pixService->gerarQrCodeBase64($payloadPix);

        $pagamento = Pagamento::create([
            'pedido_id' => $pedidoId,
            'metodo' => 'pix',
            'status' => 'pendente',
            'valor_pago' => $valor,
            'txid' => $txId,
            'pix_copia_cola' => $payloadPix,
        ]);

        return response()->json([
            'status' => true,
            'mensagem' => 'Pagamento Pix gerado com sucesso',
            'dados' => [
                'pagamento_id' => $pagamento->id,
                'pedido_id' => $pagamento->pedido_id,
                'valor_pago' => $pagamento->valor_pago,
                'txid' => $pagamento->txid,
                'pix_copia_cola' => $pagamento->pix_copia_cola,
                'qr_code' => $qrCodeBase64,
                'status' => $pagamento->status,
            ]
        ], 201);
    }

    public function aprovarPagamento(Request $request, int $id)
    {
        $usuarioLogado = $request->user();

        if ($usuarioLogado->nivel_acesso !== 'professor') {
            return response()->json([
                'mensagem' => 'Acesso não autorizado. Apenas administradores podem aprovar pagamentos.'
            ], 403);
        }

        $request->validate([
            'status' => 'required|in:aprovado,cancelado'
        ]);

        $pagamento = Pagamento::with('pedido')->findOrFail($id);
        $novoStatus = $request->input('status');

        $pagamento->status = $novoStatus;

        if ($novoStatus === 'aprovado') {
            $pagamento->data_pagamento = now();
        }

        $pagamento->save();

        if ($pagamento->pedido) {
            $pagamento->pedido->update([
                'status' => $novoStatus
            ]);
        }

        return response()->json([
            'status' => true,
            'mensagem' => "Pagamento e pedido {$novoStatus}s com sucesso!",
            'dados' => $pagamento->load('pedido')
        ]);
    }
}