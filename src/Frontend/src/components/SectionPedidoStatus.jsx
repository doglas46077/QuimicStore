import FooterCatalogo from "./FooterCatalogo";
import { ClipboardList } from 'reicon-react';
import { Calendar } from 'reicon-react';
import { AngleRight } from 'reicon-react';
import HeaderLogin from "./Header/HeaderLogin";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const API_URL = "http://localhost:8000/api";

// Ex.: #QS-2026-0042 (montado a partir do ano e do id do pedido)
function numeroDoPedido(pedido) {
    const ano = pedido.created_at ? new Date(pedido.created_at).getFullYear() : new Date().getFullYear();
    return `#QS-${ano}-${String(pedido.id).padStart(4, "0")}`;
}

function formatarPreco(valor) {
    return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatarData(data) {
    if (!data) return "-";
    return new Date(data).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" });
}

// "Detergente neutro" ou "Detergente neutro e mais 2"
function resumoDosItens(pedido) {
    const itens = pedido.itens || [];
    if (itens.length === 0) return "Sem itens";
    const primeiro = itens[0].produto?.nome || `Produto #${itens[0].produto_id}`;
    return itens.length === 1 ? primeiro : `${primeiro} e mais ${itens.length - 1}`;
}

export default function SectionPedidoStatus() {
    const navigate = useNavigate()

    const [pedidos, setPedidos] = useState([])
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState("")

    useEffect(() => {
        async function carregar() {
            try {
                const token = localStorage.getItem("token")
                const usuario = JSON.parse(localStorage.getItem("usuario") || "null")

                if (!token || !usuario) {
                    navigate("/login")
                    return
                }

                const response = await fetch(`${API_URL}/mostrar-pedido/${usuario.id}/usuario`, {
                    headers: {
                        "Accept": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                })

                if (response.status === 401) {
                    localStorage.removeItem("token")
                    localStorage.removeItem("usuario")
                    navigate("/login")
                    return
                }

                const dados = await response.json()

                // o back responde 404 quando a pessoa ainda não tem nenhum pedido (isso não é erro)
                if (response.status === 404 && dados.message?.startsWith("Nenhum pedido")) {
                    setPedidos([])
                    return
                }

                if (!response.ok) {
                    setErro(dados.message || "Não foi possível carregar os pedidos")
                    return
                }

                setPedidos(dados.dados || [])
            } catch (e) {
                setErro("Não foi possível conectar ao servidor")
            } finally {
                setCarregando(false)
            }
        }

        carregar()
    }, [])

    return (
        <>
            <HeaderLogin/>

            <div className="flex flex-col gap-6 mt-6  mb-6 items-center pb-24">
                <div className="flex gap-5 w-[90%]">
                    <div className="flex bg-emerald-100 h-30 w-30 rounded-full justify-center items-center text-emerald-950">
                        <ClipboardList size={70} />
                    </div>
                    <div className="flex flex-col justify-center">
                        <h1 className="text-4xl text-emerald-950">Meus Pedidos</h1>
                        <h3 className="text-xl">Veja o status e detalhes dos seus pedidos.</h3>
                    </div>
                </div>

                {carregando && <p className="text-slate-500">Carregando pedidos...</p>}
                {erro && <p className="text-red-600">{erro}</p>}

                {!carregando && !erro && pedidos.length === 0 && (
                    <div className="flex flex-col items-center gap-3 bg-white w-[90%] rounded-xl shadow p-10">
                        <p className="text-xl text-emerald-950">Você ainda não fez nenhum pedido</p>
                        <p className="font-normal text-slate-500">Quando fizer uma compra, ela aparece aqui.</p>
                        <button
                            type="button"
                            onClick={() => navigate("/catalogo")}
                            className="mt-2 cursor-pointer rounded-lg bg-emerald-950 px-6 py-3 text-white hover:bg-emerald-900"
                        >
                            Ver produtos
                        </button>
                    </div>
                )}

                <div className="flex flex-col gap-4 w-full items-center">
                    {pedidos.map((pedido) => (
                        <div key={pedido.id} className="flex bg-white h-45 w-[90%] shadow rounded-xl hover:scale-101 hover:duration-300 items-center justify-between">
                            <div className="flex gap-8 pl-8">
                                <div className="flex flex-col w-70 justify-center gap-2">
                                    <h1 className="text-2xl text-emerald-700">{numeroDoPedido(pedido)}</h1>
                                    <p className="truncate">{resumoDosItens(pedido)}</p>
                                    <div className="flex gap-2 text-zinc-600">
                                        <Calendar size={24} />
                                        <p>{formatarData(pedido.created_at)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex w-105 justify-end gap-40 h-35 items-center border-l-2 border-dashed border-zinc-300">
                                <div className="flex flex-col gap-3">
                                    {/* Status só visual por enquanto */}
                                    <div className="flex justify-center text-white items-center gap-2 bg-zinc-500 rounded-2xl p-1">
                                        <div className="h-4 w-4 bg-white rounded-full"></div>
                                        <h1 className="">Status</h1>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <p>Total do pedido</p>
                                        <h1 className="text-2xl text-emerald-700">{formatarPreco(pedido.valor_total)}</h1>
                                    </div>
                                </div>
                                <div className="mr-10">
                                    <div className="flex items-center justify-center h-15 w-15 bg-emerald-100 rounded-2xl hover:bg-emerald-200">
                                        <button onClick={() => navigate("/pedidoDetalhe")}>
                                            <AngleRight size={34} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <FooterCatalogo/>
        </>
    );
}