<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Produto extends Model
{
    protected $table = 'produtos';
    protected $primaryKey = 'id_produto';

    protected $fillable = [
        'nome_produto',
        'descricao',
        'imagem',
        'valor_produto',
        'quantidade_estoque',
        'disponivel',
        'prazo_producao',
        'id_categorias',
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