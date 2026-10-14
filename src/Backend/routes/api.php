<?php

use App\Http\Controllers\AvaliacaoController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\PedidosController;
use App\Http\Controllers\ProdutosController;
use Illuminate\Support\Facades\Route;

// ==========================================================================
// ! Rotas públicas
// ==========================================================================
    // Login
Route::post('/registerUser', [LoginController::class, 'store']);
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
Route::middleware('auth:sanctum')->group(function() {
    // Usuários
    Route::get('/showUsers', [LoginController::class, 'index']);
    Route::get('/showUser/{id}', [LoginController::class, 'show']);
    Route::put('/updateUser/{id}', [LoginController::class, 'update']);
    Route::delete('/deleteUser/{id}', [LoginController::class, 'destroy']);
    
    
    // Produtos
    Route::post('/registerProducts', [ProdutosController::class, 'store']);
    Route::get('/showProducts', [ProdutosController::class, 'index']);
    Route::get('/showProduct/{id}', [ProdutosController::class, 'show']);
    Route::put('/updateProduct/{id}', [ProdutosController::class, 'update']);
    Route::delete('/deleteProduct/{id}', [ProdutosController::class, 'destroy']);
    
    
    // Pedidos
    Route::post('/registerOrder', [PedidosController::class, 'store']);
    Route::get('/showOrders', [PedidosController::class, 'index']);
    Route::get('/showOrder/user/{usuario_id}', [PedidosController::class, 'show']);
    Route::put('/updateOrder/{id}', [PedidosController::class, 'update']);
    Route::delete('/deleteOrder/{id}', [PedidosController::class, 'destroy']);
    
    // Avaliacao
    Route::put('/atualizarComentario/{avaliacaoId}', [AvaliacaoController::class, 'update']);
    Route::delete('/deleteComentario/{avaliacaoId}]', [AvaliacaoController::class, 'destroy']);
    Route::post('/adicionarComentario/{reqProdutoID}', [AvaliacaoController::class, 'store']);

    // Categoria
    Route::post('/categorias', [CategoriaController::class, 'store']);
    Route::put('/categorias/atualizar/{id}', [CategoriaController::class, 'update']);
    Route::delete('/categorias/deletar/{id}', [CategoriaController::class, 'destroy']);
    });