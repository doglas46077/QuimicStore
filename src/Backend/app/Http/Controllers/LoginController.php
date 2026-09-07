<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

use function Laravel\Prompts\table;

class LoginController extends Controller
{

// =======================================================================================================
// CADASTRAR NOVO USUÁRIO
// =======================================================================================================
    public function cadastrar(Request $request) {

        $request->validate([
            "email" => 'required|email',
            "senha" => 'required|string|min:6'
        ]);

        $email = $request->input('email');
        $senha = $request->input('senha');

        if(Usuario::where('email', $email)->first()) {
            return response()->json([
                'mensagem' => 'Este e-mail já está cadastrado'
            ], 400);
        }

        $senhaCriptografadaComHash = Hash::make($senha);

        $novoUsuario = Usuario::create([
            'nome' => $email,
            'email' => $email,
            'senha' => $senhaCriptografadaComHash,
            'nivel_acesso' => 'cliente'
        ]);

        return response()->json([
            "mensagem" => "Usuário cadastrado com sucesso!",
            "dados" => $novoUsuario
        ], 201);
    }
}
