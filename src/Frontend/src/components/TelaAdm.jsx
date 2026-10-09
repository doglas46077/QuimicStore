import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderLogin from "./Header/HeaderLogin";

const API_URL = "http://localhost:8000/api";
const API_BASE = "http://localhost:8000";

const FORM_VAZIO = {
  nome: "",
  descricao: "",
  categoria_id: "",
  preco: "",
  estoque: "",
  imagem: null, 
  imagemAtual: "",
  ativo: true,
};

function resolverImagem(imagem) {
  if (!imagem) return null;
  if (/^(https?:|data:|blob:)/.test(imagem)) return imagem;
  if (!imagem.includes(".") && imagem.length > 100) return `data:image/jpeg;base64,${imagem}`;
  return `${API_BASE}/${imagem.replace(/^\/+/, "")}`;
}

function estaAtivo(produto) {
  return produto.ativo === true || produto.ativo === 1 || produto.ativo === "1";
}

function formatarPreco(valor) {
  return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function lerLista(dados) {
  return Array.isArray(dados) ? dados : dados.data || dados.produtos || dados.categorias || [];
}

function mensagemDeErro(dados, padrao) {
  if (dados?.errors) {
    const primeiro = Object.values(dados.errors)[0];
    if (primeiro?.[0]) return primeiro[0];
  }
  return dados?.message || dados?.mensagem || padrao;
}

export default function TelaAdm() {
  const navigate = useNavigate();

  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
  const ehProfessor = usuario?.nivel_acesso === "professor";
  const podeGerenciar = ehProfessor || usuario?.nivel_acesso === "estagiario";

  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");

  const [modalAberto, setModalAberto] = useState(false);
  const [idEditando, setIdEditando] = useState(null);
  const [form, setForm] = useState(FORM_VAZIO);
  const [salvando, setSalvando] = useState(false);
  const [erroForm, setErroForm] = useState("");

  const [produtoParaExcluir, setProdutoParaExcluir] = useState(null);
  const [excluindo, setExcluindo] = useState(false);
  const [erroExcluir, setErroExcluir] = useState("");

  const [ajustandoId, setAjustandoId] = useState(null);

  const [previa, setPrevia] = useState("");
  useEffect(() => {
    if (!form.imagem) {
      setPrevia("");
      return;
    }
    const url = URL.createObjectURL(form.imagem);
    setPrevia(url);
    return () => URL.revokeObjectURL(url);
  }, [form.imagem]);

  function cabecalhos(comCorpo = false) {
    const token = localStorage.getItem("token");
    return {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      ...(comCorpo ? { "Content-Type": "application/json" } : {}),
    };
  }

  function sessaoExpirada() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login", { replace: true });
  }

  useEffect(() => {
    if (!podeGerenciar) {
      navigate("/catalogo", { replace: true });
      return;
    }

    async function carregar() {
      try {
        const [respProdutos, respCategorias] = await Promise.all([
          fetch(`${API_URL}/showProducts`, { headers: cabecalhos() }),
          fetch(`${API_URL}/categorias`, { headers: { Accept: "application/json" } }),
        ]);

        if (respProdutos.status === 401) {
          sessaoExpirada();
          return;
        }

        if (respCategorias.ok) {
          setCategorias(lerLista(await respCategorias.json()));
        }

        const dados = await respProdutos.json();
        if (!respProdutos.ok) {
          setErro(mensagemDeErro(dados, "Erro ao carregar os produtos"));
          return;
        }
        setProdutos(lerLista(dados));
      } catch (e) {
        setErro("Não foi possível conectar ao servidor");
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, []);

  const produtosFiltrados = produtos.filter((p) =>
    p.nome.toLowerCase().includes(busca.trim().toLowerCase())
  );

  function nomeCategoria(id) {
    return categorias.find((c) => Number(c.id) === Number(id))?.nome || "Sem categoria";
  }

  function abrirNovo() {
    setIdEditando(null);
    setForm({ ...FORM_VAZIO, categoria_id: categorias[0]?.id ?? "" });
    setErroForm("");
    setModalAberto(true);
  }

  function abrirEdicao(produto) {
    setIdEditando(produto.id);
    setForm({
      nome: produto.nome,
      descricao: produto.descricao || "",
      categoria_id: produto.categoria_id,
      preco: String(produto.preco),
      estoque: String(produto.estoque),
      imagem: null,
      imagemAtual: produto.imagem || "",
      ativo: estaAtivo(produto),
    });
    setErroForm("");
    setModalAberto(true);
  }

  async function salvarProduto(e) {
    e.preventDefault();
    setErroForm("");
    setSalvando(true);

    const corpo = new FormData();
    corpo.append("categoria_id", form.categoria_id);
    corpo.append("nome", form.nome.trim());
    corpo.append("descricao", form.descricao.trim());
    corpo.append("preco", form.preco);
    corpo.append("estoque", form.estoque);
    corpo.append("ativo", form.ativo ? "1" : "0");
    if (form.imagem) corpo.append("imagem", form.imagem);
 
    if (idEditando) corpo.append("_method", "PUT");

    try {
      const url = idEditando
        ? `${API_URL}/updateProduct/${idEditando}`
        : `${API_URL}/registerProducts`;

      const response = await fetch(url, {
        method: "POST",
        headers: cabecalhos(), 
        body: corpo,
      });

      if (response.status === 401) {
        sessaoExpirada();
        return;
      }

      const dados = await response.json();

      if (!response.ok) {
        setErroForm(mensagemDeErro(dados, "Erro ao salvar o produto"));
        return;
      }

      const salvo = dados.data;
      if (idEditando) {
        setProdutos((atual) => atual.map((p) => (p.id === idEditando ? { ...p, ...salvo } : p)));
      } else {
        setProdutos((atual) => [...atual, salvo]);
      }
      setModalAberto(false);
    } catch (e) {
      setErroForm("Não foi possível conectar ao servidor");
    } finally {
      setSalvando(false);
    }
  }

  async function ajustarEstoque(produto, delta) {
    const novoEstoque = Math.max(0, produto.estoque + delta);
    if (novoEstoque === produto.estoque) return;

    setAjustandoId(produto.id);
    setErro("");

    try {
      const response = await fetch(`${API_URL}/updateProduct/${produto.id}`, {
        method: "PUT",
        headers: cabecalhos(true),
        body: JSON.stringify({ estoque: novoEstoque }),
      });

      if (response.status === 401) {
        sessaoExpirada();
        return;
      }

      const dados = await response.json();

      if (!response.ok) {
        setErro(mensagemDeErro(dados, "Erro ao atualizar o estoque"));
        return;
      }

      setProdutos((atual) =>
        atual.map((p) => (p.id === produto.id ? { ...p, estoque: novoEstoque } : p))
      );
    } catch (e) {
      setErro("Não foi possível conectar ao servidor");
    } finally {
      setAjustandoId(null);
    }
  }

  async function confirmarExclusao() {
    setErroExcluir("");
    setExcluindo(true);

    try {
      const response = await fetch(`${API_URL}/deleteProduct/${produtoParaExcluir.id}`, {
        method: "DELETE",
        headers: cabecalhos(),
      });

      if (response.status === 401) {
        sessaoExpirada();
        return;
      }

      const dados = await response.json();

      if (!response.ok) {
        setErroExcluir(mensagemDeErro(dados, "Erro ao remover o produto"));
        return;
      }

      setProdutos((atual) => atual.filter((p) => p.id !== produtoParaExcluir.id));
      setProdutoParaExcluir(null);
    } catch (e) {
      setErroExcluir("Não foi possível conectar ao servidor");
    } finally {
      setExcluindo(false);
    }
  }

  const campoClasse =
    "w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-700";

  return (
    <>
      <HeaderLogin />

      <div className="min-h-screen bg-olive-50">
        <main className="mx-auto max-w-6xl px-4 py-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Gerenciar produtos</h1>
              <p className="text-sm font-normal text-slate-500">
                {produtos.length} {produtos.length === 1 ? "produto cadastrado" : "produtos cadastrados"}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                type="text"
                placeholder="Buscar produto..."
                className="w-56 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-700"
              />
              <button
                onClick={() => navigate("/catalogo")}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Ver catálogo
              </button>
              <button
                onClick={abrirNovo}
                disabled={categorias.length === 0}
                className="rounded-lg bg-emerald-950 px-4 py-2 text-sm font-semibold text-white hover:scale-105 hover:transition hover:duration-300 disabled:opacity-50"
              >
                Novo produto
              </button>
            </div>
          </div>

          {erro && <p className="mb-4 text-sm text-red-600">{erro}</p>}

          <div className="overflow-x-auto rounded-xl bg-white shadow">
            <table className="w-full min-w-[180] text-sm">
              <thead className="bg-slate-50 text-left text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Produto</th>
                  <th className="px-4 py-3 font-medium">Categoria</th>
                  <th className="px-4 py-3 font-medium">Preço</th>
                  <th className="px-4 py-3 font-medium">Estoque</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal">
                {produtosFiltrados.map((p) => {
                  const src = resolverImagem(p.imagem);
                  return (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-300">
                            {src && <img src={src} alt={p.nome} className="h-full w-full object-cover" />}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">{p.nome}</p>
                            <p className="max-w-xs truncate text-xs text-slate-400">{p.descricao}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-emerald-700">{nomeCategoria(p.categoria_id)}</td>
                      <td className="px-4 py-3 text-slate-700">{formatarPreco(p.preco)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => ajustarEstoque(p, -1)}
                            disabled={ajustandoId === p.id}
                            className="h-6 w-6 rounded border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40"
                          >
                            
                          </button>
                          <span
                            className={`w-16 text-center ${
                              p.estoque === 0
                                ? "font-bold text-red-700"
                                : p.estoque < 10
                                ? "font-semibold text-amber-700"
                                : "text-slate-700"
                            }`}
                          >
                            {p.estoque === 0 ? "Esgotado" : p.estoque}
                          </span>
                          <button
                            onClick={() => ajustarEstoque(p, 1)}
                            disabled={ajustandoId === p.id}
                            className="h-6 w-6 rounded border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs ${
                            estaAtivo(p)
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {estaAtivo(p) ? "Ativo" : "Inativo"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right">
                        <button
                          onClick={() => abrirEdicao(p)}
                          className="mr-3 text-sm text-emerald-700 hover:underline"
                        >
                          Editar
                        </button>
                        {ehProfessor && (
                          <button
                            onClick={() => {
                              setErroExcluir("");
                              setProdutoParaExcluir(p);
                            }}
                            className="text-sm text-red-600 hover:underline"
                          >
                            Remover
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {carregando && (
              <p className="py-12 text-center text-sm font-normal text-slate-500">Carregando produtos...</p>
            )}
            {!carregando && produtos.length === 0 && !erro && (
              <p className="py-12 text-center text-sm font-normal text-slate-500">
                Nenhum produto cadastrado. Use "Novo produto" para adicionar o primeiro.
              </p>
            )}
            {!carregando && produtos.length > 0 && produtosFiltrados.length === 0 && (
              <p className="py-12 text-center text-sm font-normal text-slate-500">
                Nenhum produto encontrado para essa busca.
              </p>
            )}
          </div>
        </main>
      </div>

      {modalAberto && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-emerald-950/40 px-4">
          <div className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                {idEditando ? "Editar produto" : "Novo produto"}
              </h2>
              <button
                onClick={() => setModalAberto(false)}
                className="text-xl leading-none text-slate-400 hover:text-slate-700"
              >
                &times;
              </button>
            </div>

            <form onSubmit={salvarProduto} className="flex flex-col gap-3 font-normal">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Nome</label>
                <input
                  required
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  placeholder="Ex: Sabonete líquido de lavanda"
                  className={campoClasse}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Descrição</label>
                <textarea
                  required
                  rows={2}
                  maxLength={255}
                  value={form.descricao}
                  onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                  placeholder="Breve descrição do produto"
                  className={campoClasse}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Categoria</label>
                  <select
                    required
                    value={form.categoria_id}
                    onChange={(e) => setForm({ ...form, categoria_id: e.target.value })}
                    className={campoClasse}
                  >
                    {categorias.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nome}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Preço (R$)</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.preco}
                    onChange={(e) => setForm({ ...form, preco: e.target.value })}
                    placeholder="0,00"
                    className={campoClasse}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Estoque</label>
                <input
                  required
                  type="number"
                  min="0"
                  step="1"
                  value={form.estoque}
                  onChange={(e) => setForm({ ...form, estoque: e.target.value })}
                  placeholder="0"
                  className={campoClasse}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Imagem</label>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  required={!idEditando}
                  onChange={(e) => {
                    const arquivo = e.target.files[0] || null;
                    if (arquivo && arquivo.size > 2 * 1024 * 1024) {
                      setErroForm("A imagem deve ter no máximo 2 MB");
                      e.target.value = "";
                      return;
                    }
                    setErroForm("");
                    setForm({ ...form, imagem: arquivo });
                  }}
                  className="w-full text-sm"
                />
                {idEditando && (
                  <p className="mt-1 text-xs text-slate-400">
                    Deixe em branco para manter a imagem atual.
                  </p>
                )}
                {(previa || form.imagemAtual) && (
                  <img
                    src={previa || resolverImagem(form.imagemAtual)}
                    alt="Pré-visualização"
                    className="mt-2 h-24 w-24 rounded-lg object-cover"
                  />
                )}
              </div>

              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.ativo}
                  onChange={(e) => setForm({ ...form, ativo: e.target.checked })}
                  className="h-4 w-4 accent-emerald-700"
                />
                Mostrar no catálogo
              </label>

              {erroForm && <p className="text-sm text-red-600">{erroForm}</p>}

              <button
                type="submit"
                disabled={salvando}
                className="mt-1 w-full rounded-lg bg-emerald-950 py-3 text-sm font-semibold text-white hover:scale-[1.02] hover:transition hover:duration-300 disabled:opacity-60"
              >
                {salvando ? "Salvando..." : "Salvar produto"}
              </button>
            </form>
          </div>
        </div>
      )}

      {produtoParaExcluir && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-emerald-950/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl">
            <h2 className="mb-1 text-lg font-bold text-slate-900">Remover produto?</h2>
            <p className="mb-4 text-sm font-normal text-slate-500">
              "{produtoParaExcluir.nome}" será removido do banco. Essa ação não pode ser desfeita.
            </p>

            {erroExcluir && <p className="mb-3 text-sm text-red-600">{erroExcluir}</p>}

            <div className="flex gap-3">
              <button
                onClick={() => setProdutoParaExcluir(null)}
                className="flex-1 rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarExclusao}
                disabled={excluindo}
                className="flex-1 rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {excluindo ? "Removendo..." : "Remover"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}