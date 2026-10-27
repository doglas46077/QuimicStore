import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HeaderLogin from "./Header/HeaderLogin";
import { ClockCircle } from 'reicon-react';
import { CheckCircle } from 'reicon-react';
import { ClipboardList } from 'reicon-react';
import { Home3 } from 'reicon-react';

const API_URL = "http://localhost:8000/api";
const INTERVALO_MS = 5000

function IconeX({ size = 24 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M9 9l6 6M15 9l-6 6" />
        </svg>
    );
}

const VISUAL = {
    pendente: {
        titulo: "Pedido Realizado!",
        sub: "Aguarde a confirmação e retire na FIEC",
        status: "Aguardando confirmação",
        IconeTopo: CheckCircle,
        IconeStatus: ClockCircle,
        corTopo: "text-emerald-600",
        corStatus: "text-orange-400",
        fundo: "bg-emerald-100",
    },
    aprovado: {
        titulo: "Pagamento confirmado!",
        sub: "Seu pedido foi aprovado. Retire na FIEC.",
        status: "Pagamento confirmado",
        IconeTopo: CheckCircle,
        IconeStatus: CheckCircle,
        corTopo: "text-emerald-600",
        corStatus: "text-emerald-600",
        fundo: "bg-emerald-100",
    },
    cancelado: {
        titulo: "Pedido cancelado",
        sub: "Este pedido foi cancelado. Se ainda quiser os produtos, faça um novo pedido.",
        status: "Cancelado",
        IconeTopo: IconeX,
        IconeStatus: IconeX,
        corTopo: "text-red-600",
        corStatus: "text-red-600",
        fundo: "bg-red-50",
    },
};

function situacaoDe(pedido) {
    const status = [pedido.status, pedido.pagamento?.status];
    if (status.includes("aprovado")) return "aprovado";
    if (status.includes("cancelado")) return "cancelado";
    return "pendente";
}

function numeroDoPedido(pedido) {
    const ano = pedido.created_at ? new Date(pedido.created_at).getFullYear() : new Date().getFullYear();
    return `#QS-${ano}-${String(pedido.id).padStart(4, "0")}`;
}

export default function SectionStatus() {
    const navigate = useNavigate();
    const { id } = useParams(); // id do pedido

    const [pedido, setPedido] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");
    const timerRef = useRef(null);
    const ocupadoRef = useRef(false);

    function sessaoExpirada() {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        navigate("/login");
    }

    async function carregar() {
        if (ocupadoRef.current) return;
        ocupadoRef.current = true;

        try {
            const token = localStorage.getItem("token");
            const usuario = JSON.parse(localStorage.getItem("usuario") || "null");

            if (!token || !usuario) {
                sessaoExpirada();
                return;
            }

            const response = await fetch(`${API_URL}/mostrar-pedido/${usuario.id}/usuario`, {
                headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
            });

            if (response.status === 401) {
                sessaoExpirada();
                return;
            }

            if (response.status === 404) {
                navigate("/pedidos", { replace: true });
                return;
            }

            const dados = await response.json();

            if (!response.ok) {
                setErro(dados.message || "Não foi possível carregar o pedido");
                return;
            }

            const atual = (dados.dados || []).find((p) => String(p.id) === String(id));

            if (!atual) {
                navigate("/pedidos", { replace: true });
                return;
            }

            setErro("");
            setPedido(atual);

            if (situacaoDe(atual) !== "pendente") clearInterval(timerRef.current);
        } catch (e) {
            setErro("Não foi possível conectar ao servidor");
        } finally {
            ocupadoRef.current = false;
            setCarregando(false);
        }
    }

    useEffect(() => {
        carregar();
        timerRef.current = setInterval(() => {
            if (!document.hidden) carregar(); 
        }, INTERVALO_MS);

        return () => clearInterval(timerRef.current);
    }, []);

    const v = VISUAL[pedido ? situacaoDe(pedido) : "pendente"];

    return (
        <main className="flex flex-col  gap-7 min-h-screen bg-olive-50">
            <HeaderLogin />

            {carregando && !pedido && (
                <p className="text-center text-slate-500">Carregando pedido...</p>
            )}

            {!carregando && !pedido && erro && (
                <div className="flex flex-col items-center gap-3">
                    <p className="text-red-600">{erro}</p>
                    <button
                        type="button"
                        onClick={carregar}
                        className="cursor-pointer rounded-lg bg-emerald-950 px-6 py-3 text-white hover:bg-emerald-900"
                    >
                        Tentar novamente
                    </button>
                </div>
            )}

            {pedido && (
                <div className="flex flex-col  gap-3 mt-0 justify-center items-center w-full h-200 ">
                    <div className={`flex flex-col justify-center items-center w-[90%] h-[90%] ${v.fundo} shadow rounded-2xl`}>
                        <div className={`flex flex-col ${v.corTopo} justify-center items-center`}>
                            <v.IconeTopo size={100} />
                            <p className="flex justify-center text-center text-2xl h-10 w-80">{v.titulo}</p>
                            <p className="text-black text-center">{v.sub}</p>
                        </div>

                        <div className="flex justify-center items-center h-[40%] w-[90%] my-5 bg-olive-50 rounded-2xl">
                            <div className="flex flex-col justify-center items-center">
                                <div className="bg-emerald-200 text-emerald-950 p-3 rounded-full">
                                    <ClipboardList size={30} />
                                </div>
                                <p>Número de pedido</p>
                                <p className="text-2xl text-emerald-700">{numeroDoPedido(pedido)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center items-center gap-3 w-[90%] h-10">
                        <p>Status:</p>
                        <div className={`flex gap-3 ${v.corStatus}`}>
                            <v.IconeStatus size={24} />
                            <p>{v.status}</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-5 w-[90%]">

                        <button
                            type="button"
                            onClick={() => navigate("/catalogo")}
                            className="flex justify-center items-center w-full h-15 cursor-pointer text-white bg-emerald-950 rounded-lg hover:scale-101 hover:transition-transform hover:bg-emerald-900"
                        >
                            <div className="flex items-center gap-3">
                                <Home3 size={30} />
                                <p>Voltar à loja</p>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/pedidos")}
                            className="flex justify-center items-center w-full h-15 cursor-pointer bg-emerald-100 rounded-lg hover:scale-101 hover:transition-transform hover:bg-emerald-200"
                        >
                            <div className="flex items-center gap-3">
                                <ClipboardList size={30} />
                                <p className="text-emerald-950">Ver meus pedidos</p>
                            </div>
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}