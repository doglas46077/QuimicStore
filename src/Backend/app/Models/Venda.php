<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Venda extends Model
{
    protected $table = 'vendas';
    protected $primaryKey = 'id_venda';

    protected $fillable = [
        'data_venda',
        'forma_pagamento',
        'status',
        'data_atualizacao_status',
        'id_comprador',
        'id_login_estagiario',
    ];

    public function comprador()
    {
        return $this->belongsTo(Comprador::class, 'compradores', 'id_comprador');
    }

    public function login()
    {
        return $this->belongsTo(Pagamento::class, 'logins', 'id_login');
    }
}