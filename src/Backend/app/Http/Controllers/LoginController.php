<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class LoginController extends Controller
{

    // =======================================================================================================
    // CADASTRAR NOVO USUÁRIO
    // =======================================================================================================
    public function store(Request $request)
    {

        $request->validate([
            "nome" => 'required|min:3|string',
            "email" => 'required|email|unique:usuarios,email',
            "senha" => 'required|string|min:6'
        ]);

        $email = $request->input('email');
        $senha = $request->input('senha');
        $nome = $request->input('nome');

        $senhaCriptografadaComHash = Hash::make($senha);

        $novoUsuario = Usuario::create([
            'nome' => $nome,
            'email' => $email,
            'senha' => $senhaCriptografadaComHash,
            'nivel_acesso' => 'cliente'
        ]);

        $token = $novoUsuario->createToken('auth_token')->plainTextToken;

        return response()->json([
            "Status" => true,
            "Token" => $token,
            "usuario" => [
                'id' => $novoUsuario->id,
                'nome' => $novoUsuario->nome,
                'email' => $novoUsuario->email,
                'nivel_acesso' => $novoUsuario->nivel_acesso
            ],
            "Mensagem" => "Usúario cadastrado com sucesso"
        ], 201);
    }

    // =======================================================================================================
    // LOGIN DE USUÁRIO
    // =======================================================================================================  

    // VALIDAR LOGIN DO USUÁRIO
    public function login(Request $request)
    {
        $request->validate([
            "email" => 'required|email',
            "senha" => 'required|string|min:6'
        ]);

        $email = $request->input('email');
        $senha = $request->input('senha');

        $usuario = Usuario::where('email', $email)->first();

        if (empty($usuario)) {
            return response()->json([
                "mensagem" => "Email ou senha incorreta"
            ], 400);
        }

        if (!Hash::check($senha, $usuario->senha)) {
            return response()->json([
                "mensagem" => "Email ou senha incorreta"
            ], 400);
        }

        $token = $usuario->createToken('auth_token')->plainTextToken;

        return response()->json([
            "Status" => true,
            "Token" => $token,
            "usuario" => [
                'id' => $usuario->id,
                'nome' => $usuario->nome,
                'email' => $usuario->email,
                'nivel_acesso' => $usuario->nivel_acesso
            ],
            "Mensagem" => "Acesso liberado. Usuário logado com sucesso"
        ], 200);
    }


    // VER TODOS OS LOGINS

    public function index(Request $request)
    {

        $usuarioLogado = $request->user();

        if ($usuarioLogado->nivel_acesso !== 'professor') {
            return response()->json([
                "mensagem" => "Acesso não autorizado"
            ], 403);
        }

        $users = Usuario::all();

        return response()->json([
            "status" => true,
            "mensagem" => 'Exibindo todos os usuários cadastrados no sistema!',
            "usuarios" => $users
        ]);
    }

    public function show(Request $request, int $id)
    {
        $usuarioLogado = $request->user();

        $donoDaConta = $usuarioLogado->id === $id;
        $administrador = $usuarioLogado->nivel_acesso === "professor";

        if (!$donoDaConta && !$administrador) {
            return response()->json([
                "mensagem" => "Acesso não autorizado"
            ], 403); // acesso negado
        }

        $usuario = Usuario::findOrFail($id);

        return response()->json([
            "status" => true,
            "mensagem" => 'Usuário: ' . $usuario->nome . ' Encontrado com sucesso',
            "usuarios" => [
                'id' => $usuario->id,
                'nome' => $usuario->nome,
                'email' => $usuario->email,
                'nivel_acesso' => $usuario->nivel_acesso
            ],
        ]);
    }


    // ATUALIZAR ALGO DO LOGIN NO BANCO
    public function update(Request $request, int $id)
    {
        $usuarioLogado = $request->user();

        $donoDaConta = $usuarioLogado->id === $id;
        $administrador = $usuarioLogado->nivel_acesso === "professor";

        // Se o usuário do ID 5 estiver tentando excluir a conta do usuário do ID 7 ou se nao for o professor responsavel pelo site, a aplicação quebra retornando erro
        if (!$donoDaConta && !$administrador) {
            return response()->json([
                "mensagem" => "Acesso não autorizado"
            ], 403); // acesso negado
        }

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
        if ($request->filled('nome')) {
            $usuario->nome = $nome;
        }

        if ($request->filled('email')) {
            $usuario->email = $email;
        }

        if ($request->filled('senha')) {
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
    public function destroy(Request $request, int $id)
    {

        $usuarioLogado = $request->user();

        $donoDaConta = $usuarioLogado->id === $id;
        $administrador = $usuarioLogado->nivel_acesso === "professor";

        // Se o usuário do ID 5 estiver tentando excluir a conta do usuário do ID 7 ou se nao for o professor responsavel pelo site, a aplicação quebra retornando erro
        if (!$donoDaConta && !$administrador) {
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
