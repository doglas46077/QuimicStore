<?php

use App\Http\Controllers\LoginController;
use App\Http\Controllers\PedidosController;
use App\Http\Controllers\ProdutosController;
use Illuminate\Support\Facades\Route;

// ==========================================================================
// ! CADASTRO
// ==========================================================================

Route::prefix('/cadastro')->group(function () {
    // CREATE
    Route::post('/', [LoginController::class, 'cadastrar']);
    });
    
// ==========================================================================
//  ! LOGIN
// ==========================================================================
Route::prefix('/login')->group(function () {
    Route::post('/', [LoginController::class, 'login']);

    // READ
    Route::get('/', [LoginController::class, 'users']);
    Route::get('/{id}', [LoginController::class, 'user']);
    
    // UPDATE
    Route::put('/{id}', [LoginController::class, 'updateLogin']);
    
    // DELETE
    Route::delete('/{id}', [LoginController::class, 'destroy']);

});

// ==========================================================================
//  ! PRODUTOS
// ==========================================================================

Route::prefix('/produtos')->group(function() {
    // CREATE
    Route::post('/', [ProdutosController::class, 'cadastrarProduto']);

    // READ
    Route::get('/', [ProdutosController::class, 'buscarProdutos']);
    Route::get('/{id}', [ProdutosController::class, 'buscarProduto']);

    // UPDATE
    Route::put('/{id}', [ProdutosController::class, 'update']);

    // DELETE
    Route::delete('/{id}', [ProdutosController::class, 'destroy']);
});

// ==========================================================================
//  ! PEDIDOS
// ==========================================================================

Route::prefix('/pedidos')->group(function() {
    // CREATE
    Route::post('/', [PedidosController::class, 'criarPedido']);
});












































//     // use App\Http\Controllers\AvaliacaoController;
//     // use App\Http\Controllers\CategoriaController;
//     // use App\Http\Controllers\CompradorController;
//     // use App\Http\Controllers\LayersController;
//     // use App\Http\Controllers\PagamentoController;
//     // use App\Http\Controllers\ProdutoController;
//     // use App\Http\Controllers\VendaController;

// Route::post('/avaliacao', [AvaliacaoController::class, 'store']);
// Route::post('/comprador', [CompradorController::class, 'store']);
// Route::post('/categoria', [CategoriaController::class, 'store']);
// Route::post('/pagamento', [PagamentoController::class, 'store']);
// Route::post('/venda', [VendaController::class, 'store']);
// Route::post('/layers/auth', [LayersController::class, 'autenticar']);

// Route::post('/login', [LoginController::class, 'login']);
// // Route::post('/login') => Crie uma porta do tipo Post que é acessada no navegador. Exemplo: [seusite.com/api/login]
// // LoginController::class => Chama quem está dentro da classe 'loginController' que no caso é o 'login'
// // 'login' => Chama a função, ativando-a


// Route::get('/buscar-produtos', [ProdutoController::class, 'buscar']);

// // Route::profix organiza aos caminhos deixando mais limpo

// Route::prefix('produtos')->controller(ProdutoController::class)->group(function () {
// Route::get('/', 'index');
// Route::post('/', 'store');
// Route::put('/{id}', 'update');
// Route::delete('/{id}', 'destroy');
// });

//     // Route::post('/produtos', [ProdutoController::class, 'store']);
//     // Route::post('/avaliacao', [AvaliacaoController::class, 'store']);
//     // Route::post('/comprador', [CompradorController::class, 'store']);
//     // Route::post('/categoria', [CategoriaController::class, 'store']);
//     // Route::post('/pagamento', [PagamentoController::class, 'store']);
//     // Route::post('/venda', [VendaController::class, 'store']);
//     // Route::post('/layers/auth', [LayersController::class, 'autenticar']);
    
//     // Route::post('/login', [LoginController::class, 'login']);
//     // // Route::post('/login') => Crie uma porta do tipo Post que é acessada no navegador. Exemplo: [seusite.com/api/login]
//     // // LoginController::class => Chama quem está dentro da classe 'loginController' que no caso é o 'login'
//     // // 'login' => Chama a função, ativando-a
    
    
//     // Route::get('/buscar-produtos', [ProdutoController::class, 'buscar']);