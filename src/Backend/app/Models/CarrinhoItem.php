<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CarrinhoItem extends Model
{
    protected $fillable = ['carrinho_items_id', 'carrinho_id', 'id_produto', 'valor_unitario', 'quantidade'];

    
}
