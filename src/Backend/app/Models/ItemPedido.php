<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class itemPedido extends Model
{
    protected $table = 'itens_pedido';

    // desativando as tabelas created/updated pois esta dando erro e eu nao criei no banco de dados workbench 
    public $timestamps = false;

    protected $fillable = [
        'pedido_id',
        'produto_id',
        'quantidade',
        'preco_unitario_na_hora_da_compra'
    ];

    public function produto() {
        return $this->belongsTo(Produto::class, 'produto_id');
    }

    public function pedido() {
        return $this->belongsTo(Pedido::class, 'pedido_id');  
    }
}
