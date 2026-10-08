<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ListaEspera extends Model
{
    //

protected $fillable = [
'usuario_id',
'produto_id',
'status'
];


public function usuario() 
{
    return $this->belongsTo(Usuario::class, 'usuario_id');
}

}
