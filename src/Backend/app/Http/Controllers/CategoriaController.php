<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use Illuminate\Http\Request;

class CategoriaController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            "nome" => 'string|unique:categorias,nome|max:25',
            "descricao" => 'string|max:255'
        ]);


        $estagiario = $request->user()->nivel_acesso === 'estagiario';
        $professor = $request->user()->nivel_acesso === 'professor';

        if (!$estagiario && !$professor) {
            return response()->json([
                "message" => 'Acesso restrito a professores e estagiários'
            ], 403);
        }

        $categoria = Categoria::create($data);

        return response()->json([
            "message" => "Categoria criada com sucesso",
            "data" => $categoria
        ], 201);
    }


    public function index()
    {
        $categorias = Categoria::withCount('produtos')->get();

        return response()->json([
            "message" => "Exibindo categorias",
            "data"    => $categorias
        ], 200);
    }


    public function show(int $id)
    {
        $categoria = Categoria::with('produtos')->findOrFail($id);

        return response()->json([
            "message" => "Exibindo categoria",
            "data"    => $categoria
        ], 200);
    }

    public function update(Request $request, int $id)
    {
        $estagiario = $request->user()->nivel_acesso === 'estagiario';
        $professor  = $request->user()->nivel_acesso === 'professor';

        if (!$estagiario && !$professor) {
            return response()->json([
                "message" => "Acesso negado"
            ], 403);
        }

        $categoria = Categoria::findOrFail($id);

        $dadosValidados = $request->validate([
            'nome'      => 'nullable|string|unique:categorias,nome|max:25',
            'descricao' => 'nullable|string|max:255'
        ]);

        $categoria->update($dadosValidados);

        return response()->json([
            "message" => "Categoria atualizada com sucesso",
            "data"    => $categoria
        ], 200);
    }

    public function destroy(Request $request, int $id)
    {
        $administrador = $request->user()->nivel_acesso === "professor";

        if (!$administrador) {
            return response()->json([
                "message" => "Acesso não autorizado, apenas professores podem excluir categorias"
            ], 403);
        }

        $categoria = Categoria::findOrFail($id);

        if ($categoria->produtos()->count() > 0) {
            return response()->json([
                "message" => "Não é possível excluir esta categoria porque tem produtos vinculados a ela."
            ], 400);
        }

        $categoria->delete();

        return response()->json([
            "message" => "Categoria excluída com sucesso",
            "data"    => $categoria
        ], 200);
    }
}
