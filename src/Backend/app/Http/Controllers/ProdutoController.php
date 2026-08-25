<?php

namespace App\Http\Controllers;

use App\Models\Produto;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use PHPUnit\Framework\MockObject\Stub\ReturnReference;

use function PHPUnit\Framework\isEmpty;

class ProdutoController extends Controller
{
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nome_produto'       => 'required|string|max:120',
            'descricao'          => 'nullable|string|max:500',
            'valor_produto'      => 'required|numeric',
            'quantidade_estoque' => 'required|integer',
            'id_categorias'      => 'nullable|exists:categorias,id_categoria',
        ]);

        $produto = Produto::create($validatedData);

        return response()->json([
            'message' => 'Produto criado com sucesso!', 
            'produto' => $produto
        ], 201);
    }

// ! ================================================================================================================
// ! Função de busca de produtos, criada por dôglas
// ! ================================================================================================================

    public function buscar(Request $request) {
        // Primeiro, pegamos o termo no qual o usuário digitou no buscar
        // Acessamos o input dentro do objeto $request
        $termoDigitadoPeloUsuario = $request->input('input_produtos');

        // Verificamos o termo, para saber se o usuário digitou algo. Se o usuario nao digitou nada, vamos até a tabela de produtos do banco de dados, através do model "Produto" que serve como uma ponte entre o php e o banco de dados, e puxamos todos os registros através do all(); retornando todos estes registros em formato JSON
        if(!$termoDigitadoPeloUsuario) {
            $produto = Produto::all();
            return response()->json($produto); 
        }


        //Criamos a variavel resultados. Onde, através de Produto::where, acessamos a tabela de produto pelo model que serve como uma ponte entre o php e o banco de dados. Buscamos a coluna "nome_produto" e onde qualquer parte do nome tenha o termo digitado do usuario ele irá buscar. Puxamos isto através do get() que executa. Ou também através do orWhere, buscamos na descricao do produto
        $resultados = Produto::where('nome_produto', 'like', '%' . $termoDigitadoPeloUsuario . '%') 
                                ->orWhere('descricao', 'like', '%' . $termoDigitadoPeloUsuario . '%') 
                                ->get();


        // Se nao encontrar nada do que está acima, verificamos se o objeto $resultados está vazio, se estiver através do isEmpty, retornamos uma mensagem de json que nao foi encontrado nenhum produto e gerando o status error 404 not found
        if ($resultados->isEmpty()) {
            return response()->json([
                "mensagem" => "Nenhum produto encontrado"
            ], 404);
        }


        // Caso tudo de certo, retorna a variavel com o valor armazenado dos produtos em json
        return response()->json([
            "status" => true,
            "mensagem" => "Produto encontrado com sucesso" . $resultados
        ]);

// ! ================================================================================================================
// ! Função de Manutenção dos Produtos criado por Gabriel
// ! ================================================================================================================

$produto->update($validatedData);

}


// função responsável por conseguir alterar as informações do produto

public function update(Request $request) {


// altera o produto achado pelo ID

$produto = Produto::find($id);

// Verifica se o produto já foi ou não registrado no BD

if(!$produto) {
    return response()->json([
        "mensagem"=> "Produto não encontrado"
    ], 404);
}
 
// Valida se os produtos ja foram ou não registrados e fica disponível para os atualizar

$validatedData = $request->validate([
    'nome_produto'       => 'required|string|max:120',
    'descricao'          => 'nullable|string|max:500',
    'valor_produto'      => 'required|numeric',
    'quantidade_estoque' => 'required|integer',
    'id_categorias'      => 'nullable|exists:categorias,id_categoria',
]);

// O comando update faz a atualização no BD

$produto->update($validatedData);

// Envia a mensagem de atualização

return response()->json([
    "mensagem"=>"Produto atualizado com sucesso!",
    "produto"=>$produto,
], 201);

  }

//   Função para deletar um produto pelo ID dele
public function destroy($id){
    $produto = Produto::find($id);

    if(!$produto) {
        return response()->json([
            "mensagem" => "produto não encontrado"
        ], 404);
    }

// O comando update faz a remoção no BD
    $produto->delete();

    return response()->json([
        "mensagem"=> "Produto foi removido com sucesso!",
    ], 201);
}

}

    
