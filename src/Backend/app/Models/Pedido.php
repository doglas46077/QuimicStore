<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pedido extends Model
{
    protected $table = 'pedidos';
    protected $fillable = ['usuario_id', 'valor_total', 'status'];

    // Relacionamento com a tabela itens_pedido
    public function itens()
    {
        return $this->hasMany(ItemPedido::class, 'pedido_id');
    }

    // Relacionamento com a tabela pagamentos
    public function pagamento()
    {
        return $this->hasOne(Pagamento::class, 'pedido_id');
    }
}