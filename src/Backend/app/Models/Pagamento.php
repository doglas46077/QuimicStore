<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Pagamento extends Model
{
    use HasFactory;

    protected $table = 'pagamentos';

    protected $fillable = [
        'pedido_id',
        'metodo',
        'status',
        'valor_pago',
        'txid',
        'pix_copia_cola',
        'comprovante_path',
        'data_pagamento',
    ];

    protected $casts = [
        'valor_pago' => 'float',
        'data_pagamento' => 'datetime',
    ];

    public function pedido(): BelongsTo
    {
        return $this->belongsTo(Pedido::class, 'pedido_id');
    }
}