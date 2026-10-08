<?php

namespace App\Http\Controllers;

use App\Models\ListaEspera;
use App\Models\Produto;
use Illuminate\Http\Request;

class listaEsperaController extends Controller
{
 //

public function store(Request $request)
{
    $dados = $request->validate([
        'produto_id' => 'required|exists:produtos,id'
    ]);

    $produtos = Produto::findOrFail($dados['produto_id']);

    if ($produtos->estoque > 0) {
        return response()->json([
            "mensagem" => "Este produto possui estoque disponível"
        ], 400);
    }

   $itemFila = ListaEspera::firstOrCreate([
    'usuario_id' => $request->user()->id,
    'produto_id' => $dados['produto_id']
   ]);

   return response()->json([
    "mensagem" => "Adicionado a lista de espera",
    'Dados' => $itemFila
   ], 201);

}

public function produtoIndex(Request $request, $produtoID) {
    
if($request->user()->nivel_acesso !== 'professor') {
    return response()->json(['mensagem' => 'Acesso negado'], 403);
}

$fila = ListaEspera::with('usuario')->where('produto_id', $produtoID)
->where('status', 'aguardando')
->get();

return response()->json($fila, 200);

}



}
