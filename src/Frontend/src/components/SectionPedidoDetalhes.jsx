import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HeaderPedidoStatus from "./Header/HeaderPedido";
import FooterCatalogo from "./FooterCatalogo";
import { resolverImagem } from "./CardCatalogo";
import { ClockCircle } from 'reicon-react';
import { CheckCircle } from 'reicon-react';
import { X } from 'reicon-react';
import { Calendar } from 'reicon-react';
import { BagShopping } from 'reicon-react';
import { LocationAlt } from 'reicon-react';
import { TruckFast } from 'reicon-react';
import { Bill } from 'reicon-react';
import { Star } from 'reicon-react';
import { API_URL } from "./api";
import ModalAvaliacaoPedido, { EstrelasFixas } from "./AvaliarPedido";

function numeroDoPedido(pedido) {
    const ano = pedido.created_at ? new Date(pedido.created_at).getFullYear() : new Date().getFullYear();
    return `#QS-${ano}-${String(pedido.id).padStart(4, "0")}`;
}

function formatarPreco(valor) {
    return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatarDataHora(valor) {
    if (!valor) return "Aguardando atualização";
    const data = new Date(valor);
    const dia = data.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" });
    const hora = data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    return `${dia} às ${hora}`;
}

function formatarDataRetirada(valor) {
    if (!valor) return "A definir";
    const data = String(valor).slice(0, 10);
    const partes = data.split("-");
    if (partes.length !== 3) return "A definir";
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

// O back só guarda avaliação de produto, então o progresso da avaliação do pedido
// (experiência, produtos avaliados e "concluir") fica no navegador, por usuário e pedido.
function chaveAvaliacao(pedidoId) {
    const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
    return `avaliacao-pedido:${usuario?.id ?? "anonimo"}:${pedidoId}`;
}

function lerAvaliacao(pedidoId) {
    const vazio = { experiencia: null, produtos: [], concluida: false };

    try {
        const guardado = JSON.parse(localStorage.getItem(chaveAvaliacao(pedidoId)) || "null");
        return guardado ? { ...vazio, ...guardado } : vazio;
    } catch {
        return vazio;
    }
}

export default function SectionPedidoDetalhes() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [pedido, setPedido] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    const statusAtual = String(pedido?.status ?? pedido?.status_pedido ?? pedido?.pagamento?.status ?? "aguardando").toLowerCase();
    const statusNormalizado = statusAtual.includes("cancel") ? "cancelado" : statusAtual.includes("aprov") ? "aprovado" : "aguardando";
    const estiloStatus = statusNormalizado === "aguardando"
        ? { fundo: "bg-amber-200", texto: "text-amber-600", badge: "bg-amber-600", Icone: ClockCircle }
        : statusNormalizado === "aprovado"
            ? { fundo: "bg-emerald-200", texto: "text-emerald-600", badge: "bg-emerald-600", Icone: CheckCircle }
            : { fundo: "bg-red-200", texto: "text-red-600", badge: "bg-red-600", Icone: X };
    const dataStatus = pedido?.status_atualizado_em ?? pedido?.status_updated_at ?? pedido?.updated_at;
    // avaliação do pedido: { experiencia, produtos, concluida } (null = ainda carregando)
    const [avaliacao, setAvaliacao] = useState(null);
    const [avaliando, setAvaliando] = useState(false);

    useEffect(() => {
        if (!id) {
            navigate("/pedidos", { replace: true });
            return;
        }

        async function carregar() {
            try {
                const token = localStorage.getItem("token");
                const usuario = JSON.parse(localStorage.getItem("usuario") || "null");

                if (!token || !usuario) {
                    navigate("/login");
                    return;
                }

                const response = await fetch(`${API_URL}/mostrar-pedido/${usuario.id}/usuario`, {
                    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
                });

                if (response.status === 401) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("usuario");
                    navigate("/login");
                    return;
                }

                const dados = await response.json();

                if (response.status === 404 && dados.message?.startsWith("Nenhum pedido")) {
                    navigate("/pedidos", { replace: true });
                    return;
                }

                if (!response.ok) {
                    setErro(dados.message || "Não foi possível carregar o pedido");
                    return;
                }

                // acha, entre os pedidos do cliente, o que foi clicado
                const atual = (dados.dados || []).find((p) => String(p.id) === String(id));

                if (!atual) {
                    navigate("/pedidos", { replace: true });
                    return;
                }

                setPedido(atual);
                setAvaliacao(lerAvaliacao(atual.id));
            } catch (e) {
                setErro("Não foi possível conectar ao servidor");
            } finally {
                setCarregando(false);
            }
        }

        carregar();
        const atualizador = window.setInterval(carregar, 5000);
        return () => window.clearInterval(atualizador);
    }, [id]);

    // Salva a cada mudança
    useEffect(() => {
        if (!pedido?.id || !avaliacao) return;

        try {
            localStorage.setItem(chaveAvaliacao(pedido.id), JSON.stringify(avaliacao));
        } catch {
            // sem espaço/sem permissão: segue sem salvar
        }
    }, [avaliacao, pedido?.id]);

    function sessaoExpirada() {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        navigate("/login");
    }

    const itens = pedido?.itens || [];
    const totalProdutos = new Set(itens.map((item) => item.produto_id)).size;
    const produtosAvaliados = avaliacao?.produtos?.length ?? 0;
    const avaliacaoConcluida = !!avaliacao?.concluida;
    const avaliacaoEmAndamento = !!avaliacao?.experiencia || produtosAvaliados > 0;
    const subtotal = itens.reduce((soma, item) => soma + item.quantidade * item.preco_unitario_na_hora_da_compra, 0);

    return (
        <main className="flex flex-col justify-between min-h-screen bg-olive-50 pb-24">
            <HeaderPedidoStatus />

            {carregando && <p className="text-center text-slate-500">Carregando pedido...</p>}
            {erro && <p className="text-center text-red-600">{erro}</p>}

            {pedido && (
                <>
                    <div className="flex justify-center w-full">
                        <div className="flex w-[90%] justify-between">
                            <div className="flex gap-7 justify-baseline items-center w-[50%]">
                                <div className={`${estiloStatus.fundo} ${estiloStatus.texto} rounded-full p-3`}>
                                    <estiloStatus.Icone size={44} />
                                </div>
                                <div >
                                    <p className="text-2xl text-emerald-700">Pedido {numeroDoPedido(pedido)}</p>
                                    <p className="text-sm">Realizado em {formatarDataHora(pedido.created_at)}</p>
                                </div>
                            </div>

                            <div className="flex flex-col justify-center items-end w-[25%]">
                                <div className="flex justify-center w-full">
                                    <div className={`flex justify-center text-white items-center w-[35%] gap-2 ${estiloStatus.badge} rounded-2xl p-1`}>
                                        <estiloStatus.Icone size={16} />
                                        <h1>{statusNormalizado === "aguardando" ? "Aguardando" : statusNormalizado === "aprovado" ? "Aprovado" : "Cancelado"}</h1>
                                    </div>
                                </div>
                                <div>
                                    <p>Seu pedido está sendo preparado</p>
                                    <div className="flex gap-2 items-center">
                                        <p>Data de retirada:</p>
                                        <p className="text-lg text-emerald-700">{formatarDataRetirada(pedido.data_retirada ?? pedido.data_de_retirada ?? pedido.retirada_em)}</p>
                                        <Calendar size={24} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center items-center">

                        <div className="flex flex-col gap-3 p-3 bg-white shadow w-[90%] rounded-lg">
                            <div className="flex w-full gap-1 items-center">
                                <div className="bg-emerald-200 p-1 rounded-full text-emerald-700">
                                    <BagShopping size={24} />
                                </div>
                                <p>Produtos do pedido</p>
                            </div>

                            <div className="flex flex-col w-full bg-zinc-300 gap-0.5 p-0.5 rounded-lg">
                                <div className="flex justify-between px-2 py-1 text-zinc-600">
                                    <p>Produto</p>
                                    <div className="flex gap-6">
                                        <p className="w-10 text-center">Qtd.</p>
                                        <p className="w-24 text-right">Preço</p>
                                    </div>
                                </div>

                                {itens.map((item) => {
                                    const src = resolverImagem(item.produto);
                                    return (
                                        <div key={item.id} className="flex justify-between items-center p-2 bg-white w-full rounded-lg">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <div className="w-10 h-10 shrink-0 bg-zinc-400 rounded-lg overflow-hidden">
                                                    {src && <img src={src} alt="" className="h-full w-full object-cover" />}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-light truncate">
                                                        {item.produto?.nome || `Produto #${item.produto_id}`}
                                                    </p>
                                                    <p className="font-light truncate">{item.produto?.descricao}</p>
                                                </div>
                                            </div>

                                            <div className="flex gap-6 font-light">
                                                <p className="w-10 text-center">{item.quantidade}</p>
                                                <p className="w-24 text-right">
                                                    {formatarPreco(item.quantidade * item.preco_unitario_na_hora_da_compra)}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 w-[91%] ">

                            <div className="flex justify-center w-[98%] h-40 bg-white shadow m-2 rounded-lg p-3">
                                <div className="w-[96%]">
                                    <div className="flex gap-3">
                                        <div className="flex justify-center items-center text-emerald-700 bg-emerald-200 rounded-full h-8 w-8">
                                            <Bill size={20} />
                                        </div>
                                        <p>Resumo do pedido</p>
                                    </div>

                                    <div className="text-zinc-600 w-[96%]">
                                        <div className="flex justify-between p-1">
                                            <p>Subtotal</p>
                                            <p>{formatarPreco(subtotal)}</p>
                                        </div>

                                        <div className="flex justify-between p-1">
                                            <p>Total</p>
                                            <p>{formatarPreco(subtotal)}</p>
                                        </div>

                                        <div className="flex justify-between bg-emerald-200 text-emerald-800 p-1 rounded-lg">
                                            <p>Total do pedido</p>
                                            <p>{formatarPreco(pedido.valor_total)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-center w-[98%] h-40 p-3 bg-white shadow m-2 rounded-lg">
                                <div className="flex w-[96%] gap-3">
                                    <div className="flex justify-center items-center text-emerald-700 bg-emerald-200 h-8 w-8 rounded-full">
                                        <LocationAlt size={20} />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <p>Informações de retirada</p>
                                        <div className="font-light">
                                            <p className="font-bold">FIEC - Laboratório de Química</p>
                                            <p>Av. Eng. Fábio Roberto Barnabé, 3405</p>
                                            <p>Jardim Regina, Indaiatuba - SP</p>
                                            <p>CEP:13349-003</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-center  gap-2 w-[98%] h-40 p-4 bg-white shadow m-2 rounded-lg">
                                <div className="w-[96%]">
                                    <div className="flex items-center gap-3">
                                        <div className="flex justify-center items-center text-emerald-700 rounded-full bg-emerald-200 h-8 w-8">
                                            <TruckFast size={20} />
                                        </div>
                                        <p>Status de pedido</p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 w-[94%] text-sm text-zinc-600">
                                    {["aguardando", "aprovado", "cancelado"].map((status) => {
                                        const ativo = statusNormalizado === status;
                                        const rotulo = status === "aguardando" ? "Aguardando" : status === "aprovado" ? "Aprovado" : "Cancelado";
                                        const data = ativo ? (status === "aguardando" ? (dataStatus || pedido.created_at) : dataStatus) : null;
                                        return <div key={status} className="flex items-center gap-2">
                                            <span className={`h-3 w-3 rounded-full border-2 ${ativo ? (status === "cancelado" ? "bg-red-500 border-red-500" : "bg-emerald-600 border-emerald-600") : "bg-white border-gray-300"}`} />
                                            <p className="flex-1">{rotulo}</p>
                                            <p className="font-light">{data ? formatarDataHora(data) : "�"}</p>
                                        </div>;
                                    })}
                                </div>
                            </div>

                            <div className="flex justify-center w-[98%] h-40 p-3 bg-white shadow m-2 rounded-lg">
                                <div className="flex flex-col justify-center items-center w-full">
                                    <div className="flex items-center gap-3 w-[96%]">
                                        <div className="flex justify-center items-center rounded-full text-emerald-700 bg-emerald-200 h-8 w-8">
                                            <Star size={20} />
                                        </div>
                                        <p>{avaliacaoConcluida ? "Pedido avaliado" : "Avalie seu pedido"}</p>
                                    </div>

                                    {avaliacaoConcluida ? (
                                        <div className="flex flex-col w-full justify-center text-zinc-600 gap-1">
                                            <p className="flex justify-center text-center font-light">
                                                Obrigado! Sua avaliação ajuda a melhorar a QuimicStore.
                                            </p>
                                            <button
                                                disabled
                                                className="bg-slate-100 text-slate-400 p-1 rounded-lg cursor-not-allowed"
                                            >
                                                Avaliação enviada
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col w-full justify-center text-zinc-600 gap-1">
                                            <EstrelasFixas nota={0} tam={24} className="justify-center gap-5" />
                                            <p className="flex justify-center text-center font-light">
                                                {avaliacaoEmAndamento
                                                    ? `Você já avaliou ${produtosAvaliados} de ${totalProdutos} produtos.`
                                                    : "Conte-nos sobre sua experiência com a QuimicStore."}
                                            </p>
                                            <button
                                                onClick={() => setAvaliando(true)}
                                                disabled={avaliacao === null}
                                                className="bg-emerald-200 text-emerald-800 p-1 rounded-lg hover:scale-101 hover:transition-transform disabled:opacity-60 disabled:hover:scale-100"
                                            >
                                                {avaliacaoEmAndamento ? "Continuar avaliação" : "Avaliar pedido"}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                </>
            )}

            {pedido && avaliacao && (
                <ModalAvaliacaoPedido
                    aberto={avaliando}
                    onFechar={() => setAvaliando(false)}
                    pedido={pedido}
                    avaliacao={avaliacao}
                    onAtualizar={setAvaliacao}
                    onSessaoExpirada={sessaoExpirada}
                />
            )}

            <FooterCatalogo />
        </main>
    );
}
