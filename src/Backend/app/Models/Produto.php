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
        'ativo',
        'imagem'
    ];

    protected $casts = [
        // O casts usa uma convenção diferente no model do que no controller. Usa-se somente o :2 pois refere-se a duas casas decimais após a virgula.
        
        'preco' => 'decimal:2',
        'ativo' => 'boolean',
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