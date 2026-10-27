import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ClipboardList, ArrowLeft, ShieldCheck } from "reicon-react";
import HeaderLogin from "./Header/HeaderLogin";
import FooterCatalogo from "./FooterCatalogo";
import { resolverImagem } from "./CardCatalogo";
import { useCarrinho } from "./JavaScript/carrinhoAnimacao";
import { Buscarprodutos } from "./JavaScript/Buscarprodutos";
import { API_URL } from "./api";

const ROTA_CRIAR_PEDIDO = "/registrar-pedido"; 
const METODO_PAGAMENTO = "pix";

function formatarPreco(valor) {
  return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function mensagemDeErro(dados) {
  if (dados?.errors) {
    const primeiro = Object.values(dados.errors)[0];
    if (primeiro?.[0]) return primeiro[0];
  }
  if (dados?.erro?.startsWith?.("Estoque insuficiente")) return dados.erro;
  return dados?.message || dados?.mensagem || "Não foi possível criar o pedido";
}

function SectionResumoCompra() {
  const navigate = useNavigate();
  const { itens, total, totalItens, sincronizar } = useCarrinho();

  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  function sessaoExpirada() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login");
  }

  async function atualizarCarrinho() {
    if (itens.length === 0) return;

    try {
      const atuais = await Buscarprodutos(itens);
      sincronizar(atuais);
    } catch (e) {
      if (e.message === "401") sessaoExpirada();
    }
  }

  useEffect(() => {
    atualizarCarrinho();
  }, []);

  useEffect(() => {
    if (itens.length === 0) {
      navigate("/carrinho", { replace: true });
    }
  }, [itens.length]);

  async function fazerPagamento() {
    setErro("");
    setEnviando(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}${ROTA_CRIAR_PEDIDO}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          itens: itens.map((item) => ({ produto_id: item.id, quantidade: item.quantidade })),
          metodo_pagamento: METODO_PAGAMENTO,
        }),
      });

      if (response.status === 401) {
        sessaoExpirada();
        return;
      }

      const dados = await response.json();

      if (!response.ok) {
        const aviso = mensagemDeErro(dados);
        setErro(aviso);
        toast.error(aviso);
        atualizarCarrinho();
        return;
      }

      const pedido = dados.dados; 

      toast.success("Pedido criado com sucesso");

      sessionStorage.setItem(`pedido:${pedido.id}`, JSON.stringify(pedido));

      navigate(`/pagamento/${pedido.id}`, { state: { pedido } });
    } catch (e) {
      const aviso = "Não foi possível conectar ao servidor";
      setErro(aviso);
      toast.error(aviso);
    } finally {
      setEnviando(false);
    }
  }

  if (itens.length === 0) return null;

  return (
    <>
      <HeaderLogin />

      <div className="flex min-h-screen w-full flex-col bg-slate-50 pb-24">
        <div className="flex-1">
          <div className="flex items-center justify-between px-6 py-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                <ClipboardList className="h-5 w-5 text-emerald-900" />
              </span>
              <h1 className="text-xl font-bold text-slate-900">Resumo da compra</h1>
            </div>

            <button
              onClick={() => navigate("/carrinho")}
              type="button"
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-emerald-800 hover:bg-slate-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar ao carrinho
            </button>
          </div>

          <div className="mx-6 grid gap-4 md:grid-cols-[1fr_360px]">
            {/* Itens */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="mb-2 text-sm font-bold text-slate-900">Itens do pedido</p>

              <div className="divide-y divide-slate-100">
                {itens.map((item) => {
                  const src = resolverImagem(item.imagem);
                  return (
                    <div key={item.id} className="flex items-center gap-4 py-4">
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-300">
                        {src && <img src={src} alt={item.nome} className="h-full w-full object-cover" />}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-base font-bold text-slate-900">{item.nome}</p>
                        <p className="text-sm font-normal text-slate-500">
                          {item.quantidade} × {formatarPreco(item.preco)}
                        </p>
                      </div>

                      <p className="text-base font-bold text-slate-900">
                        {formatarPreco(item.preco * item.quantidade)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="h-fit rounded-2xl bg-white p-6 shadow-sm">
              <p className="mb-4 text-sm font-bold text-slate-900">Resumo</p>

              <div className="flex items-center justify-between text-sm font-normal text-slate-600">
                <span>Itens</span>
                <span>{totalItens}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm font-normal text-slate-600">
                <span>Forma de pagamento</span>
                <span>Pix (QR Code)</span>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="text-base font-bold text-slate-900">Total</span>
                <span className="text-xl font-bold text-emerald-700">{formatarPreco(total)}</span>
              </div>

              {erro && <p className="mt-3 text-sm text-red-600">{erro}</p>}

              <button
                type="button"
                onClick={fazerPagamento}
                disabled={enviando}
                className="mt-5 w-full cursor-pointer rounded-lg bg-emerald-950 py-3 text-sm font-semibold text-white hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {enviando ? "Gerando pagamento..." : "Fazer pagamento"}
              </button>

              <p className="mt-3 flex items-start gap-2 text-xs font-normal text-slate-500">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                O valor final é confirmado no momento do pagamento, com os preços atuais da loja.
              </p>
            </div>
          </div>
        </div>

        <FooterCatalogo />
      </div>
    </>
  );
}

export default SectionResumoCompra;
