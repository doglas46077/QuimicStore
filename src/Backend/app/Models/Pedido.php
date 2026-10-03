<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pedido extends Model
{
    protected $table = 'pedidos';

    protected $fillable = [
        'usuario_id',
        'valor_total',
        'status'
    ];

    public function pagamento()
    {
        // Define que um Pedido possui um Pagamento (ou tem relação de 1 para 1 / 1 para N)
        return $this->hasOne(Pagamento::class, 'pedido_id');
    }

    public function usuario() {
        return $this->belongsTo(Usuario::class, 'usuario_id');
    }

    public function itens() {
        return $this->hasMany(ItemPedido::class, 'pedido_id');
    }
}
