<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use Illuminate\Http\Request;

class CategoriaController extends Controller
{
    //
    public function store(Request $request) {
        $validatedData = $request->validate([
         'nome' =>             'required|string|max:80',
         'id_categoria_pai' => 'nullable|integer|exists:categorias,id_categoria',
        ]);

        $categoria = Categoria::create($validatedData);

        return response()->json([
            "mensagem" => "Categoria registrada com sucesso!",
            "categoria" => $categoria
        ], 201);
    }
}
