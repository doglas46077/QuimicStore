<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Categoria extends Model
{
    protected $table = 'categorias';
    protected $primaryKey = 'id_categoria';

    protected $fillable = [
        'nome',
        'id_categoria_pai',
    ];

    public function subcategoria()
    {
        return $this->hasMany(Categoria::class, 'id_categoria_pai', 'id_categoria');
    }

    public function categoriaPai()
    {
        return $this->hasMany(Categoria::class, 'id_categoria_pai', 'id_categoria');
    }
}