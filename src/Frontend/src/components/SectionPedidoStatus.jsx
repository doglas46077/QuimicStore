import FooterCatalogo from "./FooterCatalogo";
import { ClipboardList } from 'reicon-react';
import { Calendar } from 'reicon-react';
import { AngleRight } from 'reicon-react';
import HeaderLogin from "./Header/HeaderLogin";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const API_URL = "http://localhost:8000/api";

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
        const atualizador = window.setInterval(carregar, 5000)
        return () => window.clearInterval(atualizador)
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
                        <div key={pedido.id} className="flex w-[92%] flex-col gap-4 rounded-xl bg-white p-4 shadow transition hover:shadow-md sm:w-[90%] sm:flex-row sm:items-center sm:justify-between sm:p-6">
                            <div className="flex min-w-0 gap-4 sm:gap-8 sm:pl-2">
                                <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
                                    <h1 className="text-2xl text-emerald-700">{numeroDoPedido(pedido)}</h1>
                                    <p className="truncate">{resumoDosItens(pedido)}</p>
                                    <div className="flex gap-2 text-zinc-600">
                                        <Calendar size={24} />
                                        <p>{formatarData(pedido.created_at)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex w-full items-center justify-between gap-4 border-t-2 border-dashed border-zinc-300 pt-4 sm:w-auto sm:justify-end sm:gap-8 sm:border-l-2 sm:border-t-0 sm:pl-6 sm:pt-0">
                                <div className="flex flex-col gap-3">
                                  
                                    <div className={`flex justify-center text-white items-center gap-2 rounded-2xl p-1 ${String(pedido.status ?? pedido.status_pedido ?? pedido.pagamento?.status ?? "aguardando").toLowerCase().includes("cancel") ? "bg-red-600" : String(pedido.status ?? pedido.status_pedido ?? pedido.pagamento?.status ?? "aguardando").toLowerCase().includes("aprov") ? "bg-emerald-700" : "bg-amber-600"}`}>
                                        <div className="h-4 w-4 bg-white rounded-full"></div>
                                        <h1>{String(pedido.status ?? pedido.status_pedido ?? pedido.pagamento?.status ?? "aguardando").toLowerCase().includes("cancel") ? "Cancelado" : String(pedido.status ?? pedido.status_pedido ?? pedido.pagamento?.status ?? "aguardando").toLowerCase().includes("aprov") ? "Aprovado" : "Aguardando"}</h1>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <p>Total do pedido</p>
                                        <h1 className="text-2xl text-emerald-700">{formatarPreco(pedido.valor_total)}</h1>
                                    </div>
                                </div>
                                <div className="shrink-0 sm:mr-2">
                                    <div className="flex items-center justify-center h-15 w-15 bg-emerald-100 rounded-2xl hover:bg-emerald-200">
                                        <button onClick={() => navigate(`/pedidoDetalhe/${pedido.id}`)}>
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
