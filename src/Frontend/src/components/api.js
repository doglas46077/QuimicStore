const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/+$/, "");

export const API_URL = `${API_BASE_URL}/api`;

export function resolverUrlImagem(imagem) {
  if (!imagem) return null;
  if (/^(https?:|data:|blob:)/i.test(imagem)) return imagem;
  if (!imagem.includes(".") && imagem.length > 100) {
    return `data:image/jpeg;base64,${imagem}`;
  }
  return `${API_BASE_URL}/${imagem.replace(/^\/+/, "")}`;
}
