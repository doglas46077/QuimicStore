import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowLeft, X, ShieldCheck, Package, Truck, Headphones, Store } from "reicon-react";
import HeaderLogin from "./Header/HeaderLogin";
import FooterCatalogo from "./FooterCatalogo";
import { resolverImagem } from "./CardCatalogo";
import { useCarrinho } from "./JavaScript/carrinhoAnimacao";

const API_URL = "http://localhost:8000/api";

const beneficios = [
  { Icone: ShieldCheck, titulo: "Compra segura", texto: "Seus dados protegidos com criptografia" },
  { Icone: Package, titulo: "Produtos de qualidade", texto: "Selecionados especialmente para você" },
  { Icone: Truck, titulo: "Entrega rápida", texto: "Agilidade e segurança em todo pedido" },
  { Icone: Headphones, titulo: "Suporte dedicado", texto: "Estamos prontos para te ajudar" },
];

function formatarPreco(valor) {
  return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function SectionCarrinho() {
  const navigate = useNavigate();
  const { itens, total, totalItens, alterarQuantidade, remover, limpar, sincronizar } = useCarrinho();

  function finalizarCompra() {
    // Implemente a lógica de finalização do pedido aqui
  }

  useEffect(() => {
    async function atualizar() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/mostrar-produtos`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("usuario");
          navigate("/login");
          return;
        }

        if (!response.ok) return;

        const dados = await response.json();
        sincronizar(Array.isArray(dados) ? dados : dados.data || dados.produtos || []);
      } catch (e) {
        // tratamento de erro
      }
    }

    atualizar();
  }, []);

  return (
    <>
      <HeaderLogin />

      <div className="flex min-h-screen w-full flex-col bg-slate-50 pb-24">
        <div className="flex-1">
          <div className="flex items-center justify-between px-6 py-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                <ShoppingCart className="h-5 w-5 text-emerald-900" />
              </span>
              <h1 className="text-xl font-bold text-slate-900">Meu carrinho</h1>
            </div>

            <button
              onClick={() => navigate("/catalogo")}
              type="button"
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-emerald-800 hover:bg-slate-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para a loja
            </button>
          </div>

          <div className="mx-6">
            {itens.length === 0 ? (
              <div className="rounded-xl bg-white p-16 text-center shadow-sm">
                <div className="relative mx-auto flex h-50 w-50 items-center justify-center rounded-full bg-emerald-50">
                  <ShoppingCart className="h-20 w-20 text-emerald-300" strokeWidth={1.5} />
                  <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600">
                    <X className="h-4 w-4 text-white" />
                  </span>
                </div>

                <h2 className="mt-6 text-xl font-bold text-slate-900">Seu carrinho está vazio</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Parece que você ainda não adicionou nenhum produto.
                  <br />
                  Que tal explorar nossas categorias e encontrar o que precisa?
                </p>

                <button
                  onClick={() => navigate("/catalogo")}
                  type="button"
                  className="mx-auto mt-6 flex cursor-pointer items-center gap-2 rounded-lg bg-emerald-950 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-900"
                >
                  <Store className="h-4 w-4" />
                  Explorar produtos
                </button>
              </div>
            ) : (
              /* Carrinho com itens */
              <div className="flex flex-col gap-4">
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <p className="mb-2 text-sm font-bold text-slate-900">
                    {totalItens} {totalItens === 1 ? "item" : "itens"} no carrinho
                  </p>

                  <div className="divide-y divide-slate-100">
                    {itens.map((item) => {
                      const src = resolverImagem(item.imagem);
                      return (
                        <div key={item.id} className="flex items-center gap-4 py-4">
                          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-300">
                            {src && <img src={src} alt={item.nome} className="h-full w-full object-cover" />}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-base font-bold text-slate-900">{item.nome}</p>
                            <p className="text-sm font-normal text-slate-500">{formatarPreco(item.preco)} cada</p>

                            <div className="mt-2 flex items-center gap-2">
                              <button
                                onClick={() => alterarQuantidade(item.id, -1)}
                                disabled={item.quantidade <= 1}
                                className="h-7 w-7 rounded border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                              >
                                −
                              </button>
                              <span className="w-8 text-center text-sm font-semibold text-slate-900">
                                {item.quantidade}
                              </span>
                              <button
                                onClick={() => alterarQuantidade(item.id, 1)}
                                disabled={item.quantidade >= item.estoque}
                                className="h-7 w-7 rounded border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                              >
                                +
                              </button>
                              <span className="ml-2 text-xs font-normal text-slate-400">
                                {item.estoque} em estoque
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-base font-bold text-slate-900">
                              {formatarPreco(item.preco * item.quantidade)}
                            </p>
                            <button
                              onClick={() => remover(item.id)}
                              className="mt-2 text-sm font-medium text-red-600 hover:underline"
                            >
                              Remover
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-slate-900">Total</span>
                    <span className="text-xl font-bold text-emerald-700">{formatarPreco(total)}</span>
                  </div>

                  <div className="mt-5 flex gap-3">
                    <button
                      onClick={() => navigate("/catalogo")}
                      className="flex-1 rounded-lg border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Continuar comprando
                    </button>
                    <button
                      onClick={limpar}
                      className="flex-1 rounded-lg border border-red-200 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
                    >
                      Limpar carrinho
                    </button>
                  </div>
                </div>

                {/* Botão de Finalizar Compra inserido dentro do bloco com itens */}
                <button
                  type="button"
                  onClick={finalizarCompra}
                  className="w-full cursor-pointer rounded-lg bg-emerald-950 py-4 text-sm font-semibold text-white transition hover:bg-emerald-900"
                >
                  Finalizar compra
                </button>
              </div>
            )}
          </div>

          <div className="mx-10 mt-10 flex justify-between rounded-xl bg-white p-6 shadow-sm">
            {beneficios.map(({ Icone, titulo, texto }) => (
              <div key={titulo} className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50">
                  <Icone className="h-5 w-5 text-emerald-800" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{titulo}</p>
                  <p className="text-xs text-slate-500">{texto}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <FooterCatalogo />
      </div>
    </>
  );
}

export default SectionCarrinho;