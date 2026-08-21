<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comprador extends Model
{
    protected $table = 'compradores';
    protected $primaryKey = 'id_comprador';

    protected $fillable = [
        'nome',
        'matricula_layers',
        'email',
        'telefone',
    ];

}