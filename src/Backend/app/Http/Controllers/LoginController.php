<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;

class LoginController extends Controller
{
    public function cadastrar(Request $request) {
        // $request = Usuario::create

        $nome = $request->input('nome');
        $email = $request->input('email');
    }
}
