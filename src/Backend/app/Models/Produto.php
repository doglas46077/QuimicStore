<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Produto extends Model
{
    protected $table = 'produtos';

    protected $fillable = [
        'categoria_id',
        'nome',
        'descricao',
        'preco',
        'estoque',
        'ativo'
    ];

    public function categoria()
    {
        return $this->belongsTo(Categoria::class, 'id_categorias', 'id_categoria');
    }

    public function avaliacoes()
    {
        return $this->hasMany(Avaliacao::class, 'id_produtos', 'id_produto');
    }

}