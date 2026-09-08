<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

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
        $nome = Str::before($email, '@');

        if(Usuario::where('email', $email)->first()) {
            return response()->json([
                'mensagem' => 'Este e-mail já está cadastrado'
            ], 400);
        }

        $senhaCriptografadaComHash = Hash::make($senha);

        $novoUsuario = Usuario::create([
            'nome' => $nome,
            'email' => $email,
            'senha' => $senhaCriptografadaComHash,
            'nivel_acesso' => 'cliente'
        ]);

        return response()->json([
            "mensagem" => "Usuário cadastrado com sucesso!",
            "dados" => $novoUsuario
        ], 201);
    }

// =======================================================================================================
// LOGIN DE USUÁRIO
// =======================================================================================================  

    // VALIDAR LOGIN DO USUÁRIO
    public function login(Request $request) {
        $request->validate([
            "email" => 'required|email',
            "senha" => 'required|string|min:6'
        ]);

        $email = $request->input('email');
        $senha = $request->input('senha');

        $usuario = Usuario::where('email', $email)->first();

        if(empty($usuario)) {
            return response()->json([
                "mensagem" => "Email ou senha incorreta"
            ], 400);
        }

        if (!Hash::check($senha, $usuario->senha)) {
            return response()->json([
                "mensagem" => "Email ou senha incorreta"
            ], 400);
        }

        return response()->json([
            "Status" => true,
            "Mensagem" => "Acesso liberado. Usuário logado com sucesso"
        ], 201);
    }


    // VER TODOS OU UM LOGIN ESPECIFICO

    public function users() {
        $usuarios = Usuario::all();

        return response()->json([
            "status" => true,
            "mensagem" => 'Exibindo todos os usuários cadastrados no sistema!',
            "dados" => $usuarios
        ]);
    }

    public function user(int $id) {
        $usuario = Usuario::findOrFail($id);

        return response()->json([
            "status" => true,
            "mensagem" => 'Usuário: ' . $usuario->nome . ' Encontrado com sucesso',
            "dados" => $usuario
        ]);
    }


    // ATUALIZAR ALGO DO LOGIN NO BANCO
    public function updateLogin(Request $request, int $id) {
        $usuario = Usuario::findOrFail($id);

        $request->validate([
            "nome" => "string",
            "email" => "email|unique:usuarios,email," . $id, // Tipo email | caso o usuario atualize outros campos e envie a requisicao deixando o mesmo email, evita a falsa duplicidade no banco de dados. unique:usuarios,email . $id. ignora o próprio $id do usuário 
            "senha" => "nullable|string|min:6" // evitar envio de campo nullo (" ") | do tipo string | no minimo 6 caracteres
        ]);

        $nome = $request->input('nome');
        $email = $request->input('email');
        $senha = $request->input('senha');


        // filled, verifica se realmente há um valor vindo dentro do campo da requisição, evitando sobrescrever o campo com valor vazio ("")
        if($request->filled('nome')) { 
            $usuario->nome = $nome;
        }

        if($request->filled('email')) { 
            $usuario->email = $email;
        }
        
        if($request->filled('senha')) {
            $usuario->senha = Hash::make($senha);
        }

        $usuario->save();

        return response()->json([
            "status" => true,
            "mensagem" => "Dados atualizados com sucesso",
            "dados" => $usuario
        ]);
    }


    // EXCLUIR UM USUÁRIO
    public function destroy(Request $request, int $id) {

        $usuarioLogado = $request->user();

        $donoDaConta = $usuarioLogado->id === $id;
        $administrador = $usuarioLogado->nivel_acesso === "professor";

        // Se o usuário do ID 5 estiver tentando excluir a conta do usuário do ID 7 ou se nao for o professor responsavel pelo site, a aplicação quebra retornando erro
        if(!$donoDaConta && !$administrador) {
            return response()->json([
                "mensagem" => "Acesso não autorizado"
            ], 403); // acesso negado
        }

        $user = Usuario::findOrFail($id);

        $user->delete();

        return response()->json([
            "status" => true,
            "mensagem" => "Usuário deletado com sucesso",
            "dados" => $user
        ]);
    }
}
