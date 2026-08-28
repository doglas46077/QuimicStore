<?php

use App\Http\Controllers\AvaliacaoController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\CompradorController;
use App\Http\Controllers\LayersController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\PagamentoController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProdutoController;
use App\Http\Controllers\VendaController;

Route::post('/avaliacao', [AvaliacaoController::class, 'store']);
Route::post('/comprador', [CompradorController::class, 'store']);
Route::post('/categoria', [CategoriaController::class, 'store']);
Route::post('/pagamento', [PagamentoController::class, 'store']);
Route::post('/venda', [VendaController::class, 'store']);
Route::post('/layers/auth', [LayersController::class, 'autenticar']);

Route::post('/login', [LoginController::class, 'login']);
// Route::post('/login') => Crie uma porta do tipo Post que é acessada no navegador. Exemplo: [seusite.com/api/login]
// LoginController::class => Chama quem está dentro da classe 'loginController' que no caso é o 'login'
// 'login' => Chama a função, ativando-a


Route::get('/buscar-produtos', [ProdutoController::class, 'buscar']);

// Route::profix organiza aos caminhos deixando mais limpo

Route::prefix('produtos')->controller(ProdutoController::class)->group(function () {
Route::get('/', 'index');
Route::post('/', 'store');
Route::put('/{id}', 'update');
Route::delete('/{id}', 'destroy');
});