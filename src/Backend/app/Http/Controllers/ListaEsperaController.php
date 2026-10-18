<?php

namespace App\Http\Controllers;

use App\Models\ListaEspera;
use App\Models\Produto;
use Illuminate\Http\Request;

class ListaEsperaController extends Controller
{
 //==================================================================================
//  Lista de Espera
// ==================================================================================

// cria o produto
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
// percorre o id do usuario e adiciona a lista de espera
   $itemFila = ListaEspera::firstOrCreate([
    'usuario_id' => $request->user()->id,
    'produto_id' => $dados['produto_id']
   ]);

   return response()->json([
    "mensagem" => "Adicionado a lista de espera",
    'Dados' => $itemFila
   ], 201);

}
// Faz a verificação da fila da lista de espera se necessário(apenas permitido por responsáveis)
public function produtoIndex(Request $request, $produtoID) {
    
if($request->user()->nivel_acesso !== 'professor') {
    return response()->json(['mensagem' => 'Acesso negado'], 403);
}

$fila = ListaEspera::with('usuario')->where('produto_id', $produtoID)
->where('status', 'aguardando')
->get();

return response()->json($fila, 200);

}
// Faz a verificação da sua e ve sua posição na fila
public function minhaFila(Request $request)

{

    $minhasFilas = ListaEspera::with('produto')
    ->where('usuario_id', $request->user()->id)
    ->where('status', 'aguardando')
    ->get();

    return response()->json([
        "mensagem" => "Lista de espera listada com sucesso",
        "dados" => $minhasFilas
    ], 200);
}

// Caso o usuario queira sair da lista de espera pode cancelar
public function destroy(Request $request, $id) 
{
    $itemFila = ListaEspera::where('id', $id)
    ->where('usuario_id', $request->user()->id)
    ->first();

    if(!$itemFila) {
  return response()->json([
    "mensagem" => "Registro na lista de espera não encontrado"
  ], 400);
    }

    $itemFila->delete();

return response()->json([
    "mensagem" => "Removido da lista de espera com sucesso!"
],200);

}



}