import { useEffect, useState } from "react";
import { listaDeImagens } from "../api";

const EVENTO = "carrinho-atualizado";

// Cada usuário tem o seu carrinho guardado no navegador
function chaveCarrinho() {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
  return `carrinho:${usuario?.id ?? "anonimo"}`;
}

function lerCarrinho() {
  try {
    return JSON.parse(localStorage.getItem(chaveCarrinho()) || "[]");
  } catch {
    return [];
  }
}

function salvarCarrinho(itens) {
  localStorage.setItem(chaveCarrinho(), JSON.stringify(itens));
  window.dispatchEvent(new Event(EVENTO)); // avisa os outros componentes abertos
}

function estaAtivo(produto) {
  // Algumas rotas de consulta não incluem o campo `ativo`. Nesse caso,
  // preserve o item; só remova quando o servidor informar que está inativo.
  return produto.ativo === undefined || produto.ativo === null ||
    produto.ativo === true || produto.ativo === 1 || produto.ativo === "1";
}

// Devolve sempre um array de caminhos, aceitando o formato novo e o antigo
// (o banco/API pode mandar array, string simples ou string JSON)
function imagensDoProduto(produto) {
  const imagens = listaDeImagens(produto.imagens);
  if (imagens.length > 0) return imagens;
  return listaDeImagens(produto.imagem);
}

// Devolve true se adicionou, false se bateu no limite do estoque
function adicionar(produto, quantidade = 1) {
  const estoque = Number(produto.estoque);
  if (estoque <= 0) return false;

  const atual = lerCarrinho();
  const existente = atual.find((item) => String(item.id) === String(produto.id));

  if (existente) {
    if (existente.quantidade + quantidade > estoque) return false;
    existente.quantidade += quantidade;
    existente.estoque = estoque;

    // conserta itens antigos que foram salvos sem imagem
    const imagens = imagensDoProduto(produto);
    if (imagens.length > 0) existente.imagens = imagens;
  } else {
    atual.push({
      id: produto.id,
      nome: produto.nome,
      preco: Number(produto.preco),
      imagens: imagensDoProduto(produto),
      estoque,
      quantidade,
    });
  }

  salvarCarrinho(atual);
  return true;
}

// Pergunta se ainda cabe no estoque, sem adicionar nada
function podeAdicionar(produto, quantidade = 1) {
  const estoque = Number(produto.estoque);
  if (estoque <= 0) return false;
  const existente = lerCarrinho().find((item) => String(item.id) === String(produto.id));
  return (existente?.quantidade ?? 0) + quantidade <= estoque;
}

function alterarQuantidade(id, delta) {
  const atual = lerCarrinho().map((item) => {
    if (String(item.id) !== String(id)) return item;
    const nova = item.quantidade + delta;
    if (nova < 1 || nova > item.estoque) return item;
    return { ...item, quantidade: nova };
  });
  salvarCarrinho(atual);
}

function remover(id) {
  salvarCarrinho(lerCarrinho().filter((item) => String(item.id) !== String(id)));
}

function limpar() {
  salvarCarrinho([]);
}

// Atualiza preço, estoque e imagens com o que está no banco agora.
// Tira do carrinho o que foi removido, desativado ou esgotou.
function sincronizar(produtosDoBanco) {
  const atualizado = lerCarrinho()
    .map((item) => {
      const produto = produtosDoBanco.find(
        (p) => String(p.id) === String(item.id)
      );

      if (
        !produto ||
        !estaAtivo(produto) ||
        Number(produto.estoque) <= 0
      ) {
        return null;
      }

      const estoque = Number(produto.estoque);
      const imagens = imagensDoProduto(produto);

      // remove o campo antigo `imagem` do item, se existir
      const { imagem, ...resto } = item;

      return {
        ...resto,
        nome: produto.nome,
        preco: Number(produto.preco),
        imagens: imagens.length > 0 ? imagens : imagensDoProduto(item),
        estoque,
        quantidade: Math.min(item.quantidade, estoque),
      };
    })
    .filter(Boolean);

  salvarCarrinho(atualizado);
}

export function useCarrinho() {
  const [itens, setItens] = useState(lerCarrinho);

  useEffect(() => {
    const atualizar = () => setItens(lerCarrinho());
    window.addEventListener(EVENTO, atualizar);
    window.addEventListener("storage", atualizar); // outra aba do navegador
    return () => {
      window.removeEventListener(EVENTO, atualizar);
      window.removeEventListener("storage", atualizar);
    };
  }, []);

  const totalItens = itens.reduce((soma, item) => soma + item.quantidade, 0);
  const total = itens.reduce((soma, item) => soma + item.preco * item.quantidade, 0);

  return { itens, totalItens, total, adicionar, podeAdicionar, alterarQuantidade, remover, limpar, sincronizar };
}