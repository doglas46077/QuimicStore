import { useEffect, useState } from "react";

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
  return produto.ativo === true || produto.ativo === 1 || produto.ativo === "1";
}

// Devolve true se adicionou, false se bateu no limite do estoque
function adicionar(produto, quantidade = 1) {
  const estoque = Number(produto.estoque);
  if (estoque <= 0) return false;

  const atual = lerCarrinho();
  const existente = atual.find((item) => item.id === produto.id);

  if (existente) {
    if (existente.quantidade + quantidade > estoque) return false;
    existente.quantidade += quantidade;
    existente.estoque = estoque;
  } else {
    atual.push({
      id: produto.id,
      nome: produto.nome,
      preco: Number(produto.preco),
      imagem: produto.imagem,
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
  const existente = lerCarrinho().find((item) => item.id === produto.id);
  return (existente?.quantidade ?? 0) + quantidade <= estoque;
}

function alterarQuantidade(id, delta) {
  const atual = lerCarrinho().map((item) => {
    if (item.id !== id) return item;
    const nova = item.quantidade + delta;
    if (nova < 1 || nova > item.estoque) return item;
    return { ...item, quantidade: nova };
  });
  salvarCarrinho(atual);
}

function remover(id) {
  salvarCarrinho(lerCarrinho().filter((item) => item.id !== id));
}

function limpar() {
  salvarCarrinho([]);
}

// Atualiza preço e estoque com o que está no banco agora.
// Tira do carrinho o que foi removido, desativado ou esgotou.
function sincronizar(produtosDoBanco) {
  const atualizado = lerCarrinho()
    .map((item) => {
      const produto = produtosDoBanco.find((p) => p.id === item.id);
      if (!produto || !estaAtivo(produto) || Number(produto.estoque) <= 0) return null;

      const estoque = Number(produto.estoque);
      return {
        ...item,
        nome: produto.nome,
        preco: Number(produto.preco),
        imagem: produto.imagem,
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