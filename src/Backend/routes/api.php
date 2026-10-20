<?php

use App\Http\Controllers\AvaliacaoController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\ListaEsperaController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\PagamentoController;
use App\Http\Controllers\PedidosController;
use App\Http\Controllers\ProdutosController;
use Illuminate\Support\Facades\Route;

// ==========================================================================
// ! Rotas públicas
// ==========================================================================
// Login
Route::post('/cadastrar-conta', [LoginController::class, 'store']);
Route::post('/login', [LoginController::class, 'login']);

// Avaliacao
Route::get('/comentario/{produtoId}', [AvaliacaoController::class, 'index']);

// Categoria
Route::get('/categorias', [CategoriaController::class, 'index']);
Route::get('/categorias/{id}', [CategoriaController::class, 'show']);

// Recuperação de senha
Route::post('/esqueceu-senha', [LoginController::class, 'esqueceuSenha']);
Route::post('/resetar-senha', [LoginController::class, 'resetarSenha']);

// ==========================================================================
// ! Rotas com protecao
// ==========================================================================
Route::middleware('auth:sanctum')->group(function () {
    // Usuários
    Route::get('/mostrar-usuarios', [LoginController::class, 'index']);
    Route::get('/ver-usuario/{id}', [LoginController::class, 'show']);
    Route::put('/atualizar-informacoes/{id}/usuario', [LoginController::class, 'update']);
    Route::delete('/excluir/{id}/usuario', [LoginController::class, 'destroy']);


    // Produtos
    Route::post('/registrar-produto', [ProdutosController::class, 'store']);
    Route::get('/mostrar-produtos', [ProdutosController::class, 'index']);
    Route::get('/mostrar-produto/{id}/produto', [ProdutosController::class, 'show']);
    Route::put('/atualizar-produto/{id}/produto', [ProdutosController::class, 'update']);
    Route::delete('/excluir-produto/{id}/produto', [ProdutosController::class, 'destroy']);


    // Pedidos
    Route::post('/registrar-pedido', [PedidosController::class, 'store']);
    Route::get('/mostrar-pedidos', [PedidosController::class, 'index']);
    Route::get('/mostrar-pedido/{usuario_id}/usuario', [PedidosController::class, 'show']);
    Route::put('/atualizar-pedidoo/{id}/pedid', [PedidosController::class, 'update']);
    Route::delete('/excluir-pedido/{id}/pedido', [PedidosController::class, 'destroy']);
    // atualiza o pedido
    Route::post('/finalizar-pedido/{id}/pedido', [PedidosController::class, 'fecharPedido']);

    // Avaliacao
    Route::post('/registrar-comentario/{reqProdutoID}', [AvaliacaoController::class, 'store']);
    Route::put('/atualizar-avaliacao/{avaliacaoId}', [AvaliacaoController::class, 'update']);
    Route::delete('/excluir-comentario/{avaliacaoId}]', [AvaliacaoController::class, 'destroy']);

    // Categoria
    Route::post('/registrar-categoria', [CategoriaController::class, 'store']);
    Route::put('/categorias/{id}/atualizar', [CategoriaController::class, 'update']);
    Route::delete('/categorias/{id}/deletar', [CategoriaController::class, 'destroy']);


    // lista de espera
    Route::post('/lista-espera', [ListaEsperaController::class, 'store']);
    Route::get('/meus-pedidos/lista-espera', [ListaEsperaController::class , 'minhaFila']);
    Route::delete('/lista-espera/{id}', [ListaEsperaController::class, 'destroy']);
    // Ver a fila de um unico produto (apenas acesso por professores)
    Route::get('produtos/{produtoID}/lista-espera', [ListaEsperaController::class, 'produtoIndex']);

    // pix
    Route::post('/pagamentos/pix', [PagamentoController::class, 'gerarPix']);
    Route::post('/pagamentos/{id}/comprovante', [PagamentoController::class, 'enviarComprovante']);
    Route::put('/pagamentos/{id}/status', [PagamentoController::class, 'aprovarPagamento']);
});
