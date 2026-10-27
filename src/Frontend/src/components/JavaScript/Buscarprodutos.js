const API_URL = "http://localhost:8000/api";


export async function Buscarprodutos(itens) {
  const token = localStorage.getItem("token");

  const resultados = await Promise.all(
    itens.map(async (item) => {
      const response = await fetch(`${API_URL}/mostrar-produto/${item.id}/produto`, {
        headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) throw new Error("401");
      if (response.status === 404) return null;
      if (!response.ok) throw new Error("erro");

      const dados = await response.json();
      return dados.data;
    })
  );

  return resultados.filter(Boolean);
}