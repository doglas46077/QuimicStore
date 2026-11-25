<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Produto extends Model
{
    use HasFactory;

    protected $table = 'produtos';

    protected $fillable = [
        'categoria_id',
        'nome',
        'descricao',
        'preco',
        'estoque',
        'tempo_fabricacao',
        'ativo',
        'imagens'
    ];



    protected $casts = [
        // O casts usa uma convenção diferente no model do que no controller. Usa-se somente o :2 pois refere-se a duas casas decimais após a virgula.
        'preco' => 'decimal:2',
        'ativo' => 'boolean',
        'tempo_fabricacao' => 'integer',
        'imagens' => 'array'
    ];



    public function categoria()
    {
        return $this->belongsTo(Categoria::class, 'categoria_id');
    }

    public function avaliacoes()
    {
        return $this->hasMany(Avaliacao::class, 'produto_id');
    }

    protected $appends = ['imagens_url'];

    public function getImagensUrlAttribute(): array
    {
        return array_map(fn($caminho) => asset($caminho), $this->imagens ?? []);
    }
}
