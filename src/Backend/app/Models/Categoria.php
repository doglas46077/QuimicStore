<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Categoria extends Model
{
    protected $table = 'categorias';

    protected $fillable = [
        'nome',
        'descricao'
    ];

    public function produtos()
    {
        // Nao precisa coloca o id_categoria, pois, como se trata apenas da própria categoria, o laravel ja consegue identificar
        return $this->hasMany(Produto::class, 'categoria_id');
    }

}