<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Avaliacao extends Model
{
    protected $table = 'avaliacoes';
    protected $primaryKey = 'id_avaliacao';

    protected $fillable = [
        'id_produto',
        'id_comprador',
        'nota',
        'comentario',
        'status_moderacao',
        'data_avaliacao',
    ];

    public function comprador()
    {
        return $this->belongsTo(Comprador::class, 'id_comprador', 'id_comprador');
    }

    public function produto()
    {
        return $this->belongsTo(Produto::class, 'id_produto', 'id_produto');
    }
}