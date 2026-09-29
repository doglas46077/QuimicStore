<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AvaliacaoController extends Controller
{
    public function store(Request $request) {
        $request->validate([
            "produto_id" => 'integer|unique:produtos,id',
            "usuario_id" => 'integer|unique:usuarios,id',
            "nota" => 'integer|'
        ]);
    }
}
