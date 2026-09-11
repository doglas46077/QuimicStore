<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pagamento extends Model
{
    protected $table = 'pagamentos';

    protected $fillable = [
        'pedido_id',
        'metodo',
        'status',
        'valor_pago',
        'data_pagamento'
    ];


    public function pedido(){
        return $this->belongsTo(Pedido::class, 'pedido_id');
    }
}