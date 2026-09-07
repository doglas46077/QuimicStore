<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class itemPedido extends Model
{
    protected $table = 'itens_pedido';

    protected $fillable = [
        'pedido_id',
        'produto_id',
        'quantidade',
        'preco_unitario_na_hora_da_compra'
    ];

    public function produtos() {
        return $this->belongsTo(Produto::class, 'produto_id');
    }

    public function pedidos() {
        return $this->belongsTo(Pedido::class, 'pedido_id');  
    }
}
