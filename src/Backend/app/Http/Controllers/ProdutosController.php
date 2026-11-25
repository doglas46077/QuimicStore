<?php

namespace App\Http\Controllers;

use App\Models\Produto;
use Illuminate\Http\Request;

class ProdutosController extends Controller
{
    // ===================================================================================================
    // AUXILIARES DE IMAGEM
    // ===================================================================================================
    private function salvarImagens(array $files): array
    {
        $caminhos = [];

        foreach ($files as $file) {
            $nomeimg = time() . '-' . uniqid() . '-' . $file->getClientOriginalName();

            $file->move(public_path('img/produtosImgs'), $nomeimg);

            $caminhos[] = 'img/produtosImgs/' . $nomeimg;
        }

        return $caminhos;
    }

    private function apagarImagens(array $caminhos): void
    {
        foreach ($caminhos as $caminho) {
            if (is_string($caminho) && file_exists(public_path($caminho))) {
                unlink(public_path($caminho));
            }
        }
    }

    // Sempre devolve um array, mesmo que o dado no banco esteja em formato antigo
    private function imagensDoProduto(Produto $produto): array
    {
        $imagens = $produto->imagens;

        if (is_string($imagens)) {
            $dec = json_decode($imagens, true);
            $imagens = is_array($dec) ? $dec : ($imagens !== '' ? [$imagens] : []);
        }

        return is_array($imagens) ? array_values($imagens) : [];
    }

    // ===================================================================================================
    // CADASTRAR PRODUTO
    // ===================================================================================================
    public function store(Request $request)
    {
        $estagiario = $request->user()->nivel_acesso === 'estagiario';
        $professor = $request->user()->nivel_acesso === 'professor';

        if (!$estagiario && !$professor) {
            return response()->json([
                "message" => "Acesso negado"
            ], 403);
        }

        $productData = $request->validate([
            'categoria_id' => 'required|integer|exists:categorias,id',
            'nome' => 'required|string|unique:produtos,nome',
            'descricao' => 'required|string|max:255',
            'preco' => 'required|numeric|decimal:0,2|min:0',
            'estoque' => 'required|integer|min:0',
            'tempo_fabricacao' => 'nullable|integer|min:1|max:365',
            'ativo' => 'required|boolean',
            'imagens' => 'nullable|array|max:5',
            'imagens.*' => 'image|mimes:jpeg,png,jpg,webp|max:2048'
        ]);

        unset($productData['imagens']);

        if ($request->hasFile('imagens')) {
            $productData['imagens'] = $this->salvarImagens($request->file('imagens'));
        }

        $newProduct = Produto::create($productData);

        return response()->json([
            "message" => "Produto criado com sucesso",
            "data" => $newProduct
        ], 201);
    }

    // ===================================================================================================
    // BUSCAR TODOS PRODUTOS
    // ===================================================================================================
    public function index(Request $request)
    {
        $perPage = max(1, min((int) $request->query('per_page', 30), 50));

        $produtos = Produto::orderBy('id')->paginate($perPage);

        return response()->json([
            "message" => "Exibindo produtos",
            "data" => $produtos->items(),
            "meta" => [
                "current_page" => $produtos->currentPage(),
                "last_page"    => $produtos->lastPage(),
                "per_page"     => $produtos->perPage(),
                "total"        => $produtos->total(),
            ],
        ], 200);
    }

    // ===================================================================================================
    // BUSCAR UM PRODUTO ESPECIFICO
    // ===================================================================================================
    public function show(int $id)
    {
        $produto = Produto::findOrFail($id);

        return response()->json([
            "message" => "Exibindo produto",
            "data" => $produto
        ], 200);
    }

    // ===================================================================================================
    // ATUALIZAR PRODUTO
    // ===================================================================================================
    public function update(Request $request, int $id)
    {
        $estagiario = $request->user()->nivel_acesso === 'estagiario';
        $professor = $request->user()->nivel_acesso === 'professor';

        if (!$estagiario && !$professor) {
            return response()->json([
                "message" => "Acesso negado"
            ], 403);
        }

        $produto = Produto::findOrFail($id);

        $dataAtualizados = $request->validate([
            'categoria_id' => 'integer|exists:categorias,id',
            'nome' => 'string|unique:produtos,nome,' . $id,
            'descricao' => 'string|max:255',
            'preco' => 'numeric|decimal:0,2|min:0',
            'estoque' => 'integer|min:0',
            'tempo_fabricacao' => 'nullable|integer|min:1|max:365',
            'ativo' => 'boolean',
            'imagens' => 'nullable|array|max:5',
            'imagens.*' => 'image|mimes:jpeg,png,jpg,webp|max:2048',
            'remover_imagens' => 'nullable|array',
            'remover_imagens.*' => 'string'
        ]);

        $atuais = $this->imagensDoProduto($produto);

        // só aceita remover caminhos que realmente pertencem ao produto
        $remover = array_values(array_intersect((array) $request->input('remover_imagens', []), $atuais));
        $mantidas = array_values(array_diff($atuais, $remover));
        $novas = $request->hasFile('imagens') ? $request->file('imagens') : [];

        if (count($mantidas) + count($novas) > 5) {
            return response()->json([
                "message" => "O produto pode ter no máximo 5 imagens"
            ], 422);
        }

        unset($dataAtualizados['remover_imagens'], $dataAtualizados['imagens']);

        if (!empty($novas) || !empty($remover)) {
            $dataAtualizados['imagens'] = array_merge($mantidas, $this->salvarImagens($novas));
        }

        $produto->update($dataAtualizados);

        // só apaga os arquivos depois do banco atualizado
        $this->apagarImagens($remover);

        return response()->json([
            "message" => "Produto atualizado com sucesso",
            "data" => $produto
        ], 200);
    }

    // ===================================================================================================
    // DELETAR PRODUTO
    // ===================================================================================================
    public function destroy(Request $request, int $id)
    {
        $usuarioLogado = $request->user();

        $administrador = $usuarioLogado->nivel_acesso === "professor";

        if (!$administrador) {
            return response()->json([
                "message" => "Acesso não autorizado, apenas professores podem excluir produtos"
            ], 403); // acesso negado
        }

        $produto = Produto::findOrFail($id);

        $this->apagarImagens($this->imagensDoProduto($produto));

        $produto->delete();

        return response()->json([
            "message" => "Produto excluído",
            "data" => $produto
        ], 200);
    }
}
