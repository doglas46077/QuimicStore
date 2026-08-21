<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pagamento extends Model
{
    protected $table = 'pagamentos';
    protected $primaryKey = 'id_pagamento';

    protected $fillable = [
        'id_venda',
        'status_pagamento',
        'comprovante',
        'data_confirmacao',
        'descricao'
    ];


    public function venda(){
        return $this->belongsTo(Venda::class, 'vendas', 'id_venda');
    }
}