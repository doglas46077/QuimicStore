import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderLogin from "./Header/HeaderLogin";
import { API_URL, resolverUrlImagem } from "./api";

const FORM_VAZIO = {
  nome: "",
  descricao: "",
  categoria_id: "",
  preco: "",
  estoque: "",
  imagens: [],
  imagensAtuais: [],
  imagensRemovidas: [],
  ativo: true,
};

const OPCAO_STATUS_PEDIDO = [
  { value: "aprovado", label: "Aprovado" },
  { value: "cancelado", label: "Cancelado" },
];

function resolverImagem(imagem) {
  if (!imagem || typeof imagem !== "string") return "";
  return resolverUrlImagem(imagem);
}

function listaImagens(produto) {
  const imagens = produto.imagens;

  if (Array.isArray(imagens)) return imagens.filter((i) => typeof i === "string" && i);

  if (typeof imagens === "string" && imagens) {
    try {
      const dec = JSON.parse(imagens);
      if (Array.isArray(dec)) return dec.filter((i) => typeof i === "string" && i);
    } catch (e) {
      // não era JSON: caminho único
    }
    return [imagens];
  }

  return [];
}

function estaAtivo(produto) {
  return (
    produto.ativo === true ||
    produto.ativo === 1 ||
    produto.ativo === "1"
  );
}

function formatarPreco(valor) {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function lerLista(dados) {
  return Array.isArray(dados)
    ? dados
    : dados.data || dados.produtos || dados.categorias || [];
}

function mensagemDeErro(dados, padrao) {
  if (dados?.errors) {
    const primeiro = Object.values(dados.errors)[0];
    if (primeiro?.[0]) return primeiro[0];
  }

  return dados?.message || dados?.mensagem || padrao;
}

function listaPedidosPossivel(dados) {
  if (Array.isArray(dados)) return dados;
  if (Array.isArray(dados?.data)) return dados.data;
  if (Array.isArray(dados?.dados)) return dados.dados;
  if (Array.isArray(dados?.pedidos)) return dados.pedidos;
  return [];
}

function statusDoPedido(pedido) {
  return String(pedido?.status ?? pedido?.status_pedido ?? "pendente").toLowerCase();
}

function nomeStatusPedido(status) {
  const valor = statusDoPedido({ status });
  const rotulos = {
    pendente: "Aguardando",
    aguardando: "Aguardando",
    aprovado: "Aprovado",
    cancelado: "Cancelado",
    em_preparo: "Em preparo",
    enviado: "Enviado",
    entregue: "Entregue",
    pronto_para_retirada: "Pronto pra Retirada",
  };
  return rotulos[valor] || valor;
}

function prepararPedidosStatus(pedidos) {
  return pedidos.map((pedido) => {
    const status = statusDoPedido(pedido);
    return { ...pedido, status, status_pedido: status };
  });
}

export default function TelaAdm() {
  const navigate = useNavigate();

  const usuario = JSON.parse(
    localStorage.getItem("usuario") || "null"
  );

  const ehProfessor = usuario?.nivel_acesso === "professor";

  const podeGerenciar =
    ehProfessor || usuario?.nivel_acesso === "estagiario";

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

  const [previas, setPrevias] = useState([]);
  const [statusVendaAberto, setStatusVendaAberto] = useState(false);
  const [pedidosStatus, setPedidosStatus] = useState([]);
  const [carregandoStatus, setCarregandoStatus] = useState(false);
  const [erroStatus, setErroStatus] = useState("");
  const [atualizandoStatusId, setAtualizandoStatusId] = useState(null);

  // Criar pré-visualização das imagens novas
  useEffect(() => {
    const urls = form.imagens.map((f) => URL.createObjectURL(f));
    setPrevias(urls);

    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [form.imagens]);

  useEffect(() => {
    if (!statusVendaAberto) return;

    async function carregarPedidosStatus() {
      setCarregandoStatus(true);
      setErroStatus("");

      try {
        const rotas = [
          `${API_URL}/mostrar-pedido`,
          `${API_URL}/mostrar-pedidos`,
          `${API_URL}/pedidos`,
        ];

        let pedidos = [];

        for (const url of rotas) {
          try {
            const response = await fetch(url, {
              headers: cabecalhos(),
            });

            if (response.status === 401) {
              sessaoExpirada();
              return;
            }

            if (response.ok) {
              const dados = await response.json();
              const lista = listaPedidosPossivel(dados);

              if (lista.length > 0 || response.status === 200) {
                setPedidosStatus(prepararPedidosStatus(lista));
                return;
              }

              pedidos = lista;
            }
          } catch (e) {
            // tenta a próxima rota
          }
        }

        setPedidosStatus(prepararPedidosStatus(pedidos));
      } catch (e) {
        setErroStatus("Não foi possível carregar os pedidos para alterar o status.");
      } finally {
        setCarregandoStatus(false);
      }
    }

    carregarPedidosStatus();
  }, [statusVendaAberto]);

  async function alterarStatusPedido(pedidoId, novoStatus) {
    const pedidoAnterior = pedidosStatus.find((pedido) => Number(pedido.id) === Number(pedidoId));
    const pagamentoId = pedidoAnterior?.pagamento?.id ?? pedidoAnterior?.pagamento_id;

    if (!pagamentoId) {
      setErroStatus("Este pedido não possui pagamento associado para alterar o status.");
      return;
    }

    const statusAnterior = statusDoPedido(pedidoAnterior);

    setPedidosStatus((atual) =>
      atual.map((pedido) =>
        Number(pedido.id) === Number(pedidoId)
          ? { ...pedido, status: novoStatus, status_pedido: novoStatus }
          : pedido
      )
    );
    setAtualizandoStatusId(pedidoId);
    setErroStatus("");

    let ultimoErro = "Não foi possível alterar o status do pedido.";

    try {
      const response = await fetch(`${API_URL}/pagamentos/${pagamentoId}/status`, {
        method: "PUT",
        headers: cabecalhos(true),
        body: JSON.stringify({ status: novoStatus }),
      });

      if (response.status === 401) {
        sessaoExpirada();
        return;
      }

      const dados = await response.json().catch(() => ({}));

      if (response.ok) {
        const statusAtualizado = dados?.dados?.pedido?.status ?? dados?.dados?.status ?? novoStatus;
        const statusFinal = statusDoPedido({ status: statusAtualizado });

        setPedidosStatus((atual) =>
          atual.map((pedido) =>
            Number(pedido.id) === Number(pedidoId)
              ? { ...pedido, status: statusFinal, status_pedido: statusFinal }
              : pedido
          )
        );
        return;
      }

      ultimoErro = mensagemDeErro(dados, ultimoErro);
    } catch {
      ultimoErro = "Não foi possível conectar ao servidor.";
    } finally {
      setAtualizandoStatusId(null);
    }

    setPedidosStatus((atual) =>
      atual.map((pedido) =>
        Number(pedido.id) === Number(pedidoId)
          ? { ...pedido, status: statusAnterior, status_pedido: statusAnterior }
          : pedido
      )
    );
    setErroStatus(ultimoErro);
    setAtualizandoStatusId(null);
  }

  function cabecalhos(comCorpo = false) {
    const token = localStorage.getItem("token");

    return {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      ...(comCorpo
        ? { "Content-Type": "application/json" }
        : {}),
    };
  }

  function sessaoExpirada() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login", { replace: true });
  }

  // Carregar produtos e categorias
  useEffect(() => {
    if (!podeGerenciar) {
      navigate("/catalogo", { replace: true });
      return;
    }

    async function carregar() {
      try {
        const [respProdutos, respCategorias] =
          await Promise.all([
            fetch(`${API_URL}/mostrar-produtos`, {
              headers: cabecalhos(),
            }),
            fetch(`${API_URL}/categorias`, {
              headers: {
                Accept: "application/json",
              },
            }),
          ]);

        if (respProdutos.status === 401) {
          sessaoExpirada();
          return;
        }

        if (respCategorias.ok) {
          setCategorias(
            lerLista(await respCategorias.json())
          );
        }

        const dados = await respProdutos.json();

        if (!respProdutos.ok) {
          setErro(
            mensagemDeErro(
              dados,
              "Erro ao carregar os produtos"
            )
          );
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
    return (
      categorias.find(
        (c) => Number(c.id) === Number(id)
      )?.nome || "Sem categoria"
    );
  }

  // Abrir cadastro
  function abrirNovo() {
    setIdEditando(null);

    setForm({
      ...FORM_VAZIO,
      categoria_id: categorias[0]?.id ?? "",
    });

    setErroForm("");
    setModalAberto(true);
  }

  // Abrir edição
  function abrirEdicao(produto) {
    setIdEditando(produto.id);

    setForm({
      nome: produto.nome,
      descricao: produto.descricao || "",
      categoria_id: produto.categoria_id,
      preco: String(produto.preco),
      estoque: String(produto.estoque),
      imagens: [],
      imagensAtuais: listaImagens(produto),
      imagensRemovidas: [],
      ativo: estaAtivo(produto),
    });

    setErroForm("");
    setModalAberto(true);
  }

  // Salvar produto
  async function salvarProduto(e) {
    e.preventDefault();

    const mantidas =
      form.imagensAtuais.length - form.imagensRemovidas.length;

    if (mantidas + form.imagens.length === 0) {
      setErroForm("O produto precisa ter pelo menos uma imagem");
      return;
    }

    setErroForm("");
    setSalvando(true);

    const corpo = new FormData();

    corpo.append("categoria_id", form.categoria_id);
    corpo.append("nome", form.nome.trim());
    corpo.append("descricao", form.descricao.trim());
    corpo.append("preco", form.preco);
    corpo.append("estoque", form.estoque);
    corpo.append("ativo", form.ativo ? "1" : "0");

    form.imagens.forEach((arquivo) => {
      corpo.append("imagens[]", arquivo);
    });

    form.imagensRemovidas.forEach((caminho) => {
      corpo.append("remover_imagens[]", caminho);
    });

    if (idEditando) {
      corpo.append("_method", "PUT");
    }

    try {
      const url = idEditando
        ? `${API_URL}/atualizar-produto/${idEditando}/produto`
        : `${API_URL}/registrar-produto`;

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
        setErroForm(
          mensagemDeErro(dados, "Erro ao salvar o produto")
        );
        return;
      }

      const salvo = dados.data;

      if (idEditando) {
        setProdutos((atual) =>
          atual.map((p) =>
            p.id === idEditando ? { ...p, ...salvo } : p
          )
        );
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

  // Ajustar estoque
  async function ajustarEstoque(produto, delta) {
    const novoEstoque = Math.max(
      0,
      produto.estoque + delta
    );

    if (novoEstoque === produto.estoque) return;

    setAjustandoId(produto.id);
    setErro("");

    try {
      const response = await fetch(
        `${API_URL}/atualizar-produto/${produto.id}/produto`,
        {
          method: "PUT",
          headers: cabecalhos(true),
          body: JSON.stringify({
            estoque: novoEstoque,
          }),
        }
      );

      if (response.status === 401) {
        sessaoExpirada();
        return;
      }

      const dados = await response.json();

      if (!response.ok) {
        setErro(
          mensagemDeErro(
            dados,
            "Erro ao atualizar o estoque"
          )
        );
        return;
      }

      setProdutos((atual) =>
        atual.map((p) =>
          p.id === produto.id
            ? { ...p, estoque: novoEstoque }
            : p
        )
      );
    } catch (e) {
      setErro("Não foi possível conectar ao servidor");
    } finally {
      setAjustandoId(null);
    }
  }

  // Excluir produto
  async function confirmarExclusao() {
    setErroExcluir("");
    setExcluindo(true);

    try {
      const response = await fetch(
        `${API_URL}/excluir-produto/${produtoParaExcluir.id}/produto`,
        {
          method: "DELETE",
          headers: cabecalhos(),
        }
      );

      if (response.status === 401) {
        sessaoExpirada();
        return;
      }

      const dados = await response.json();

      if (!response.ok) {
        setErroExcluir(
          mensagemDeErro(
            dados,
            "Erro ao remover o produto"
          )
        );
        return;
      }

      setProdutos((atual) =>
        atual.filter(
          (p) => p.id !== produtoParaExcluir.id
        )
      );

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
              <h1 className="text-2xl font-bold text-slate-900">
                Gerenciar produtos
              </h1>

              <p className="text-sm font-normal text-slate-500">
                {produtos.length}{" "}
                {produtos.length === 1
                  ? "produto cadastrado"
                  : "produtos cadastrados"}
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

              <button
                onClick={() => setStatusVendaAberto(true)}
                className="rounded-lg bg-emerald-950 px-4 py-2 text-sm font-semibold text-white hover:scale-105 hover:transition hover:duration-300"
              >
                Status De Venda
              </button>

              <button
                className="rounded-lg bg-emerald-950 px-4 py-2 text-sm font-semibold text-white hover:scale-105 hover:transition hover:duration-300 disabled:opacity-50"
              >
                Perfil de Usuário  
              </button>
            
            </div>
          </div>

          {erro && (
            <p className="mb-4 text-sm text-red-600">
              {erro}
            </p>
          )}

          <div className="overflow-x-auto rounded-xl bg-white shadow">
            <table className="w-full min-w-175 text-sm">
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
                  const src = resolverImagem(listaImagens(p)[0]);

                  return (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-300">
                            {src && (
                              <img
                                src={src}
                                alt={p.nome}
                                className="h-full w-full object-cover"
                              />
                            )}
                          </div>

                          <div>
                            <p className="font-semibold text-slate-800">
                              {p.nome}
                            </p>

                            <p className="max-w-xs truncate text-xs text-slate-400">
                              {p.descricao}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-emerald-700">
                        {nomeCategoria(p.categoria_id)}
                      </td>

                      <td className="px-4 py-3 text-slate-700">
                        {formatarPreco(p.preco)}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => ajustarEstoque(p, -1)}
                            disabled={ajustandoId === p.id}
                            className="h-6 w-6 rounded border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40"
                          >
                            −
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
                            {p.estoque === 0
                              ? "Esgotado"
                              : p.estoque}
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
              <p className="py-12 text-center text-sm font-normal text-slate-500">
                Carregando produtos...
              </p>
            )}

            {!carregando && produtos.length === 0 && !erro && (
              <p className="py-12 text-center text-sm font-normal text-slate-500">
                Nenhum produto cadastrado. Use "Novo produto" para adicionar o primeiro.
              </p>
            )}

            {!carregando &&
              produtos.length > 0 &&
              produtosFiltrados.length === 0 && (
                <p className="py-12 text-center text-sm font-normal text-slate-500">
                  Nenhum produto encontrado para essa busca.
                </p>
              )}
          </div>
        </main>
      </div>

      {/* Modal de cadastro e edição */}
      {modalAberto && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-emerald-950/40 px-4 py-4">

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

            <form
              onSubmit={salvarProduto}
              className="flex flex-col gap-3 font-normal"
            >

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Nome
                </label>

                <input
                  required
                  value={form.nome}
                  onChange={(e) =>
                    setForm({ ...form, nome: e.target.value })
                  }
                  placeholder="Ex: Sabonete líquido de lavanda"
                  className={campoClasse}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Descrição
                </label>

                <textarea
                  required
                  rows={2}
                  maxLength={255}
                  value={form.descricao}
                  onChange={(e) =>
                    setForm({ ...form, descricao: e.target.value })
                  }
                  placeholder="Breve descrição do produto"
                  className={campoClasse}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Categoria
                  </label>

                  <select
                    required
                    value={form.categoria_id}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        categoria_id: e.target.value,
                      })
                    }
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
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Preço (R$)
                  </label>

                  <input
                    required
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.preco}
                    onChange={(e) =>
                      setForm({ ...form, preco: e.target.value })
                    }
                    placeholder="0,00"
                    className={campoClasse}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Estoque
                </label>

                <input
                  required
                  type="number"
                  min="0"
                  step="1"
                  value={form.estoque}
                  onChange={(e) =>
                    setForm({ ...form, estoque: e.target.value })
                  }
                  placeholder="0"
                  className={campoClasse}
                />
              </div>

              {/* Campo de imagens personalizado */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Imagens do produto
                </label>

                <label
                  htmlFor="imagem-produto"
                  className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-emerald-700 bg-emerald-50/50 px-4 py-5 text-center transition hover:border-emerald-900 hover:bg-emerald-50"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="26"
                      height="26"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-emerald-800"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="m21 15-5-5L5 21" />
                    </svg>
                  </div>

                  <span className="text-sm font-semibold text-emerald-900">
                    Clique para selecionar as imagens
                  </span>

                  <span className="text-xs text-slate-500">
                    PNG, JPG ou WEBP • Máximo 5 imagens, 2 MB cada
                  </span>

                  <span className="mt-1 rounded-lg bg-emerald-950 px-5 py-2 text-sm font-semibold text-white">
                    Escolher imagens
                  </span>

                  <input
                    id="imagem-produto"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="sr-only"
                    multiple
                    onChange={(e) => {
                      const novos = Array.from(e.target.files);
                      e.target.value = "";

                      if (novos.some((a) => a.size > 2 * 1024 * 1024)) {
                        setErroForm("Cada imagem deve ter no máximo 2 MB");
                        return;
                      }

                      const mantidas =
                        form.imagensAtuais.length -
                        form.imagensRemovidas.length;

                      if (
                        mantidas + form.imagens.length + novos.length >
                        5
                      ) {
                        setErroForm(
                          "O produto pode ter no máximo 5 imagens"
                        );
                        return;
                      }

                      setErroForm("");
                      setForm({
                        ...form,
                        imagens: [...form.imagens, ...novos],
                      });
                    }}
                  />
                </label>

                {idEditando && (
                  <p className="mt-2 text-xs text-slate-400">
                    As novas imagens são adicionadas às atuais (máximo 5 no
                    total). Clique no × para remover uma imagem.
                  </p>
                )}

                {(previas.length > 0 || form.imagensAtuais.length > 0) && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {form.imagensAtuais
                      .filter((img) => !form.imagensRemovidas.includes(img))
                      .map((img) => (
                        <div key={img} className="relative">
                          <img
                            src={resolverImagem(img)}
                            alt="Imagem atual"
                            className="h-24 w-24 rounded-xl border border-slate-200 object-cover"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              setForm({
                                ...form,
                                imagensRemovidas: [
                                  ...form.imagensRemovidas,
                                  img,
                                ],
                              })
                            }
                            className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs leading-none text-white"
                          >
                            &times;
                          </button>
                        </div>
                      ))}

                    {previas.map((src, i) => (
                      <div key={src} className="relative">
                        <img
                          src={src}
                          alt={`Nova imagem ${i + 1}`}
                          className="h-24 w-24 rounded-xl border-2 border-emerald-600 object-cover"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setForm({
                              ...form,
                              imagens: form.imagens.filter(
                                (_, idx) => idx !== i
                              ),
                            })
                          }
                          className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs leading-none text-white"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.ativo}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      ativo: e.target.checked,
                    })
                  }
                  className="h-4 w-4 accent-emerald-700"
                />

                Mostrar no catálogo
              </label>

              {erroForm && (
                <p className="text-sm text-red-600">
                  {erroForm}
                </p>
              )}

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

      {/* Modal de exclusão */}
      {produtoParaExcluir && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-emerald-950/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl">

            <h2 className="mb-1 text-lg font-bold text-slate-900">
              Remover produto?
            </h2>

            <p className="mb-4 text-sm font-normal text-slate-500">
              "{produtoParaExcluir.nome}" será removido do banco.
              Essa ação não pode ser desfeita.
            </p>

            {erroExcluir && (
              <p className="mb-3 text-sm text-red-600">
                {erroExcluir}
              </p>
            )}

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

      {/* Modal de status de venda */}
      {statusVendaAberto && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-emerald-950/40 px-4 py-4">
          <div className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white p-5 shadow-xl sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                Alterar status de venda
              </h2>

              <button
                onClick={() => setStatusVendaAberto(false)}
                className="text-xl leading-none text-slate-400 hover:text-slate-700"
              >
                &times;
              </button>
            </div>

            {erroStatus && (
              <p className="mb-4 text-sm text-red-600">
                {erroStatus}
              </p>
            )}

            <div className="mb-4 min-h-0 overflow-y-auto">
              {carregandoStatus ? (
                <p className="py-12 text-center text-sm font-normal text-slate-500">
                  Carregando pedidos...
                </p>
              ) : (
                <table className="w-full table-fixed text-xs sm:text-sm">
                  <colgroup>
                    <col className="w-[10%]" />
                    <col className="w-[22%]" />
                    <col className="w-[16%]" />
                    <col className="w-[20%]" />
                    <col className="w-[32%]" />
                  </colgroup>
                  <thead className="bg-slate-50 text-left text-slate-500">
                    <tr>
                      <th className="px-4 py-3 font-medium">Pedido</th>
                      <th className="px-4 py-3 font-medium">Cliente</th>
                      <th className="px-4 py-3 font-medium">Data</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Novo status</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 font-normal">
                    {pedidosStatus.map((pedido) => (
                      <tr key={pedido.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <span className="font-semibold text-slate-800">
                            {pedido.id}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <span className="wrap-break-word">{pedido.cliente_nome || "Cliente desconhecido"}</span>
                        </td>

                        <td className="px-4 py-3">
                          {new Date(pedido.created_at).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs ${
                              ["pendente", "aguardando"].includes(statusDoPedido(pedido))
                                ? "bg-amber-50 text-amber-700"
                                : statusDoPedido(pedido) === "aprovado"
                                ? "bg-emerald-50 text-emerald-700"
                                : statusDoPedido(pedido) === "cancelado"
                                ? "bg-red-50 text-red-700"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {nomeStatusPedido(statusDoPedido(pedido))}
                          </span>
                        </td>

                        <td className="px-3 py-3 sm:px-4">
                              <select
                                value={OPCAO_STATUS_PEDIDO.some((opcao) => opcao.value === statusDoPedido(pedido)) ? statusDoPedido(pedido) : ""}
                            disabled={atualizandoStatusId === pedido.id}
                            aria-label={`Alterar status do pedido ${pedido.id}`}
                            onChange={(e) => alterarStatusPedido(pedido.id, e.target.value)}
                            className="w-full min-w-0 rounded-md border border-slate-200 bg-white px-2 py-2 text-xs text-slate-700 outline-none focus:border-emerald-700 disabled:cursor-wait disabled:opacity-60 sm:text-sm"
                          >
                            <option value="" disabled>Selecionar status</option>
                            {OPCAO_STATUS_PEDIDO.map((opcao) => (
                              <option key={opcao.value} value={opcao.value}>
                                {opcao.label}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <button
              onClick={() => setStatusVendaAberto(false)}
              className="w-full rounded-lg bg-emerald-950 py-3 text-sm font-semibold text-white hover:scale-[1.02] hover:transition hover:duration-300"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
}