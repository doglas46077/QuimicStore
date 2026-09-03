<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use PhpParser\Builder\Function_;


// Class => Planta do código, como uma planta de uma casa
// LoginController => O nome da classe
// Extends => A classe "LoginController" Herdará, as ferramentas padrão de um controller. A base do framework
class LoginController extends Controller
{
    
// ===============================================================================================
// Criando uma função que recebe o Request, que é tratado como o envolope que guarda os dados que o usuário digitou na tela, com o e-mail e senha
// ===============================================================================================


    // public => A função pública pode ser utilizada em outras partes do sistema (outros arquivos)
    // $request => É o envelope com os dados que o front end mandou
    // Request => Vem antes para avisar ao php que a variavel é do tipo de requisição web
    public function validarLogin(Request $request) {
        
        

        // $request->validade => A seta serve para acessar uma propriedade dentro de um objeto. Neste trecho, o $request está executando uma ação de validar (validade)
        // 'required|email' => A barra funciona como um "E": Que seja OBRIGATÓRIA & do tipo EMAIL
        $request->validate([
            'email' => 'required|email',
            'senha' => 'required'
        ]);


        // usuario => Chama o model, os dois pontos, serve para "importar" o model, sem precisar criar ele antes
        // where('email', $request->email) => Buscar onde a coluna email, seja igual ao e-mail que veio do envolope $request
        // Firts => Pega apenas o primeiro registro que encontrar
        $usuario = Usuario::where('email', $request->email)->first();

        
        
        // !Hash::check($request->senha, $usuario->senha) => Pega a senha digitada pelo usuario através do request e compara com a senha criptografada no banco, se não concidiram da erro. ou se o $usuario nao existir, tambem da erro.
        if(!$usuario || !Hash::check($request->senha, $usuario->senha)) {
            return response()->json([
                'erro' => 'E-mail ou senha inválidas'
            ], 401);
        }

        return response()->json([
            'Mensagem' => 'Login aprovado!',
            'Usuário' => [
                'nome' => $usuario->nome,
                'email' => $usuario->email,
                'nivel_acesso' => $usuario->nivel_acesso
            ]
        ]);
    }
}


