<?php

use App\Http\Controllers\CategoriasController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\PedidosController;
use App\Http\Controllers\ProdutosController;
use Illuminate\Support\Facades\Route;

// ==========================================================================
// ! Rotas públicas
// ==========================================================================
Route::post('/registerUser', [LoginController::class, 'store']);
Route::post('/login', [LoginController::class, 'login']);
Route::get('/categorias', [CategoriasController::class, 'index']);

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

    // Categorias
    Route::post('/categorias', [CategoriasController::class, 'store']);

    // Pedidos
    Route::post('/registerOrder', [PedidosController::class, 'store']);
    Route::get('/showOrders', [PedidosController::class, 'index']);
    Route::get('/showOrder/user/{usuario_id}', [PedidosController::class, 'show']);
    Route::put('/updateOrder/{id}', [PedidosController::class, 'update']);
    Route::delete('/deleteOrder/{id}', [PedidosController::class, 'destroy']);
    // atualiza o pedido
    Route::post('/finalizeOrder/{id}/pedido', [PedidosController::class, 'fecharPedido']);
});