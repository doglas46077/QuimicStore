<?php

namespace App\Http\Controllers;

use App\Models\itemPedido;
use App\Models\Pedido;
use App\Models\Produto;
use App\Models\Usuario;
use Illuminate\Http\Client\Events\RequestSending;
use Illuminate\Http\Request;

use function PHPUnit\Framework\isEmpty;

class PedidosController extends Controller
{
    public function criarPedido(Request $request) {
        $pedidoArmazenado = $request->validate([
            // Aprendi esta forma de array com IA 
            // array ('itens') que é uma requisição obrigatória e que tenha no mínimo 1 produto dentro do array de itens
            'itens' => 'required|array|min:1',
            // percorrer ('*') no array ('itens') pegando cada item(produto_id) dentro do array, verifica se realmente foi enviada, do tipo inteiro e realmente existe na tabela produtos
            'itens.*.produto_id' => 'required|integer|exists:produtos,id',
            'itens.*.quantidade' => 'required|integer|min:1'
        ]);

        // se a quantidade retirada pelo usuário for maior do que há no estoque, solta um erro que para tudo
            foreach ($pedidoArmazenado['itens'] as $item) {
                $produto = Produto::find($item['produto_id']);

                if ($item['quantidade'] > $produto->estoque) {
                    throw new \Exception("Estoque insuficiente para o produto: {$produto->nome}");
                }
            }

        // pega o id do usuario que está adicionando os produtos no carrinho
        //* $usuario = $request->user()->id;

        // cria um status inicial, com o id do usuairio, o status pendente e o valor total iniciado em zero
        $pedido = Pedido::create([
            'usuario_id' => 1,
            'status' => 'pendente',
            'valor_total' => 0,

        ]);

        // cria o valor total para ser usado no final para ser atribuido no campo de valorTotal da tabela pedido
        $valorTotal = 0;

        // Processar cada item do carrinho através do foreach
        foreach($pedidoArmazenado['itens'] as $item) {
            $produto = Produto::find($item['produto_id']);


            // decrementa da tabela estoque, o total da quantidade que o usuário digitou
            $produto->decrement('estoque', $item['quantidade']);

            // insere na tabela pedido, o id do produto, a quantidade pedida e o preco unitario do produto
            $pedido->itens()->create([
                'produto_id' => $produto->id,
                'quantidade' => $item['quantidade'],
                'preco_unitario_na_hora_da_compra'=> $produto->preco
            ]);

            // valor total recebe o preco do produto vezes a quantidade solicitada
            $valorTotal += $produto->preco * $item['quantidade'];
        }

        // atualiza no campo valorTotal de pedido com o valor acumulado
        $pedido->update(['valor_total' => $valorTotal]);

        return response()->json([
            "mensagem" => 'Pedido adicionado ao carrinho com sucesso',
            // busca no model pedido, a funcao itens e retorna os registros da tabela itens_pedidos vinculados ao id do pedido // Aprendi com IA
            "dados" => $pedido->load('itens')
        ], 201);
    }


// =================================================================================================
// Buscar todos os pedidos de todos os usuários
// =================================================================================================
    public function buscarTodosPedidos() {
        $pedidos = Pedido::with('usuario', 'itens.produto')->get();

        return response()->json([
            "mensagem" => "Todos os pedidos de todos os usuários registrados ao sistema",
            "dados" => $pedidos
        ]);
    }



// =================================================================================================
// BUSCAR PEDIDO POR USUÁRIO 
// =================================================================================================
    public function buscarPedidoPorUsuario(int $id) {
        $pedidos = Pedido::with('usuario', 'itens.produto')->where('usuario_id', $id)->get();
        
        if(count($pedidos) === 0) {
            return response()->json([
                "mensagem" => 'Usuário ainda não tem um pedido'
            ], 404);
        }

        return response()->json([
            "mensagem" => 'O usuario ' . $id . ' tem estes itens no carrinho:',
            "dados" => $pedidos
        ]);
    }


 // =======================================================================================================
    // Atualizar pedido
 // =======================================================================================================

    public function update(Request $request, int $id) {
        $dataUpdate = $request->validate([
            
        ]);
    }

}

