const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/+$/, "");

export const API_URL = `${API_BASE_URL}/api`;

export function resolverUrlImagem(imagem) {
  if (!imagem) return null;
  if (typeof imagem !== "string") return null;
  if (/^(https?:|data:|blob:)/i.test(imagem)) return imagem;
  if (!imagem.includes(".") && imagem.length > 100) {
    return `data:image/jpeg;base64,${imagem}`;
  }
  // codifica cada parte do caminho (espaços, #, % etc. quebravam a imagem)
  const caminho = imagem
    .replace(/^\/+/, "")
    .split("/")
    .map((parte) => encodeURIComponent(decodeURIComponentSeguro(parte)))
    .join("/");
  return `${API_BASE_URL}/${caminho}`;
}

function decodeURIComponentSeguro(texto) {
  try {
    return decodeURIComponent(texto);
  } catch {
    return texto;
  }
}

// Aceita array, string simples ou string JSON e devolve sempre um array de caminhos.
// Usado pelo catálogo, página do produto, carrinho, resumo e pedidos.
export function listaDeImagens(imagens) {
  if (Array.isArray(imagens)) {
    return imagens.filter((i) => typeof i === "string" && i);
  }

  if (typeof imagens === "string" && imagens) {
    try {
      const dec = JSON.parse(imagens);
      if (Array.isArray(dec)) return dec.filter((i) => typeof i === "string" && i);
      if (typeof dec === "string" && dec) return [dec];
    } catch {
      // não era JSON: trata como caminho único
    }
    return [imagens];
  }

  return [];
}

// Normaliza os formatos usados pela API e pelas telas do carrinho/pedidos.
export function imagensDoProduto(produto) {
  if (!produto) return [];

  const fontes = [produto.imagens, produto.imagem, produto.imagem_url];
  for (const fonte of fontes) {
    const imagens = listaDeImagens(fonte);
    if (imagens.length) return imagens;
  }

  return [];
}
