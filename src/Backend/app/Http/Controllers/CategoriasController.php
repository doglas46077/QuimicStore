<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use Illuminate\Http\Request;

class CategoriasController extends Controller
{
    //
 public function store(Request $request) {

 $dados = $request->validate([
  "nome" => "required|string|unique:categorias,nome",
  "descricao" => "required|string|max:255"
 ]);

 $categorias = Categoria::create($dados);

 return response()->json([
    "mensagem" => "categoria criada com sucesso!",
    "Dados" => $categorias
 ],201);

 }

public function index()
    {
        return response()->json(Categoria::all(), 200);
    }

}
