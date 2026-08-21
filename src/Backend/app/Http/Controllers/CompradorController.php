<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Comprador;
use Illuminate\Http\Request;

class CompradorController extends Controller
{
    //
    public function store(Request $request) {
 $validatedData = $request->validate([
    'nome' =>             'required|string|max:120',
    'matricula_layers' => 'required|string|max:50|unique:compradores,matricula_layers',
    'email' =>            'nullable|string|max:150',
    'telefone' =>         'nullable|string|max:15'
 ]);

  $comprador = Comprador::create($validatedData);

  return response()->json([
    "mensagem" => "Comprador cadastrado com sucesso!",
    'comprador' => $comprador
  ],201);

    }
}
