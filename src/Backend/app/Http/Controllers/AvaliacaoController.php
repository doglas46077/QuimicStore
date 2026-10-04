<?php

namespace App\Http\Controllers;

use App\Models\Avaliacao;
use App\Models\Produto;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Event\RequestEvent;

class AvaliacaoController extends Controller
{
    public function store(Request $request, int $reqProdutoID)
    {
        $request->validate([
            "nota" => "required|integer|between:1,5",
            "comentario" => "string|nullable"
        ]);

        $userId = $request->user()->id;
        $produtoid = Produto::findOrFail($reqProdutoID);
        $nota = $request->input('nota');
        $comentario = $request->input('comentario');


        $avaliacao = Avaliacao::create([
            "produto_id" => $produtoid->id,
            "usuario_id" => $userId,
            "nota" => $nota,
            "comentario" => $comentario
        ]);

        return response()->json([
            "message" => "Avaliação enviada",
            "data" => $avaliacao
        ], 201);
    }

    public function index(int $produtoId)
    {
        $avaliacoes = Avaliacao::with(['usuario:id,nome', 'produto:id,nome,descricao,preco'])->where('produto_id', $produtoId)->get();

        return response()->json([
            "message" => 'Comentários buscados com sucesso',
            "data" => $avaliacoes
        ]);
    }

    public function update(Request $request, int $avaliacaoId)
    {
        $request->validate([
            "nota" => "required|integer|between:1,5",
            "comentario" => "string|nullable"
        ]);

        $user = $request->user();

        if (!$user) {
            return response()->json([
                "message" => "Acesso negado",
            ], 403);
        }

        $novaAvaliacao = Avaliacao::where('usuario_id', $user->id)->where('id', $avaliacaoId)->first();

        if ($novaAvaliacao) {
            $novaAvaliacao->update([
                "nota" => $request->input('nota'),
                "comentario" => $request->input('comentario')
            ]);
        } else {
            return response()->json([
                "message" => "Somente o dono que criou a avaliação pode alterá-la"
            ], 403);
        }

        return response()->json([
            'message' => "Avaliação atualizada com sucesso!",
            'data' => $novaAvaliacao
        ], 200);
    }

    public function destroy(Request $request, int  $avaliacaoId)
    {
        $usuarioLogado = $request->user();

        $administrador = $usuarioLogado->nivel_acesso === "professor";
        $avaliacao = Avaliacao::where('usuario_id', $usuarioLogado->id)->where('id', $avaliacaoId)->first();

        if($administrador) {
            $pegaAvaliacaoAdmin = Avaliacao::where('id', $avaliacaoId)->first();
            if($pegaAvaliacaoAdmin) {
                $pegaAvaliacaoAdmin->delete();
            } else {
                return response()->json([
                    "message" => "Avaliacao nao existe"
                ], 404);
            }
        } elseif($avaliacao) {
            $avaliacao->delete();
        } else {
            return response()->json([
                "message" => "Acesso negado, apenas professores ou donos da avaliacao podem deletar",
            ], 403);
        }

        return response()->json([
            "message" => "Avaliação excluída"
        ], 200);
    }
}


