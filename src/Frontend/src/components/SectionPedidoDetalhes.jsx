import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HeaderPedidoStatus from "./Header/HeaderPedido";
import FooterCatalogo from "./FooterCatalogo";
import { resolverImagem } from "./CardCatalogo";
import { ClockCircle } from 'reicon-react';
import { Calendar } from 'reicon-react';
import { BagShopping } from 'reicon-react';
import { LocationAlt } from 'reicon-react';
import { Star } from 'reicon-react';
import { TruckFast } from 'reicon-react';
import { Bill } from 'reicon-react';

import { API_URL } from "./api";

function numeroDoPedido(pedido) {
    const ano = pedido.created_at ? new Date(pedido.created_at).getFullYear() : new Date().getFullYear();
    return `#QS-${ano}-${String(pedido.id).padStart(4, "0")}`;
}

function formatarPreco(valor) {
    return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatarDataHora(valor) {
    const data = new Date(valor);
    const dia = data.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" });
    const hora = data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    return `${dia} às ${hora}`;
}

export default function SectionPedidoDetalhes() {
    const navigate = useNavigate();
    const { id } = useParams(); 

    const [pedido, setPedido] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

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
            } catch (e) {
                setErro("Não foi possível conectar ao servidor");
            } finally {
                setCarregando(false);
            }
        }

        carregar();
    }, [id]);

    const itens = pedido?.itens || [];
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
                                <div className="bg-yellow-200 text-yellow-500 rounded-full p-3">
                                    <ClockCircle size={44} />
                                </div>
                                <div >
                                    <p className="text-2xl text-emerald-700">Pedido {numeroDoPedido(pedido)}</p>
                                    <p className="text-sm">Realizado em {formatarDataHora(pedido.created_at)}</p>
                                </div>
                            </div>

                            <div className="flex flex-col justify-center items-end w-[25%]">
                                <div className="flex justify-center w-full">
                                    <div className="flex justify-center text-white items-center w-[35%] gap-2 bg-zinc-500 rounded-2xl p-1">
                                        <div className="h-4 w-4 bg-white rounded-full"></div>
                                        <h1 className="">Status</h1>
                                    </div>
                                </div>
                                <div>
                                    <p>Seu pedido está sendo preparado</p>
                                    <div className="flex gap-2 items-center">
                                        <p>Data de retirada:</p>
                                        <p className="text-lg text-emerald-700">00/00/0000</p>
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
                                    const src = resolverImagem(item.produto?.imagens);
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

                                <div className="flex gap-7 justify- w-[94%]">
                                    <div>
                                        {[1, 2, 3, 4].map((item, index) => (
                                            <div key={item} className="flex flex-col items-center">
                                                <div className={`w-4 h-4 rounded-full border-2 ${
                                                    index === 0 ? "bg-orange-400 border-orange-400" : "bg-white border-gray-300"
                                                }`} />
                                                {index < 3 && <div className="w-0.5 h-1 bg-gray-300" />}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="w-full text-sm text-zinc-600">
                                        <div className="flex justify-between w-full">
                                            <p>Pedido realizado</p>
                                            <p className="font-light">data e horario</p>
                                        </div>

                                        <div className="flex justify-between w-full">
                                            <p>Em preparação</p>
                                            <p className="font-light">data e horario</p>
                                        </div>

                                        <div className="flex justify-between w-full">
                                            <p>Pronto para retirada</p>
                                            <p className="font-light">data e horario</p>
                                        </div>

                                        <div className="flex justify-between w-full">
                                            <p>Retirado</p>
                                            <p className="font-light">data e horario</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-center w-[98%] h-40 p-3 bg-white shadow m-2 rounded-lg">
                                <div className="flex flex-col justify-center items-center w-full">
                                    <div className="flex items-center gap-3 w-[96%]">
                                        <div className="flex justify-center items-center rounded-full text-emerald-700 bg-emerald-200 h-8 w-8">
                                            <Star size={20} />
                                        </div>
                                        <p>Avalie seu pedido</p>
                                    </div>
                                    <div className="flex flex-col w-full justify-center text-zinc-600 gap-1">
                                        <div className="flex gap-7 justify-center">
                                            <Star size={25} />
                                            <Star size={25} />
                                            <Star size={25} />
                                            <Star size={25} />
                                            <Star size={25} />
                                        </div>
                                        <p className="flex justify-center font-light">Conte-nos sobre sua experiência com a QuimicStore.</p>
                                        <button className="bg-emerald-200 text-emerald-800 p-1 rounded-lg hover:scale-101 hover:transition-transform">
                                            Avaliar pedido
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </>
            )}

            <FooterCatalogo />
        </main>
    );
}