import { Home3 } from 'reicon-react';
import { ClipboardList } from 'reicon-react';
import { Gear } from 'reicon-react';
import { useLocation, useNavigate } from 'react-router-dom';
import CestaCarrinho from './CestaCarrinho';

function classeDoItem(ativo) {
    const base = "flex flex-col items-center p-2 border-b-3 transition duration-200"
    return ativo
        ? `${base} text-emerald-700 border-b-emerald-700`
        : `${base} border-b-transparent hover:text-emerald-700 hover:border-b-emerald-700`
}

export default function FooterCatalogo() {
    const navigate = useNavigate()
    const { pathname } = useLocation()

    const estou = (...rotas) => rotas.some((rota) => pathname === rota || pathname.startsWith(`${rota}/`))

    const inicioAtivo = estou("/catalogo")
    const carrinhoAtivo = estou("/carrinho", "/resumo")
    const pedidosAtivo = estou("/pedidos", "/pedidoStatus", "/pedidoDetalhe", "/pagamento", "/pedido-realizado")
    const adminAtivo = estou("/adm")

    const usuario = JSON.parse(localStorage.getItem("usuario") || "null")
    const ehEquipe = usuario?.nivel_acesso === "professor" || usuario?.nivel_acesso === "estagiario"

    return (
        <footer className="fixed bottom-0 left-0 z-50 h-20 w-full bg-white">
            <div className="flex h-full items-center justify-around gap-1 px-2 sm:gap-4">
                <div className={classeDoItem(inicioAtivo)}>
                    <button onClick={() => navigate("/catalogo")} aria-current={inicioAtivo ? "page" : undefined}>
                        <Home3 size={30} />
                        <h1>Início</h1>
                    </button>
                </div>

                <div className={classeDoItem(carrinhoAtivo)}>
                    <button onClick={() => navigate("/carrinho")} aria-current={carrinhoAtivo ? "page" : undefined}>
                        <CestaCarrinho size={30} />
                        <h1>Carrinho</h1>
                    </button>
                </div>

                <div className={classeDoItem(pedidosAtivo)}>
                    <button onClick={() => navigate("/pedidos")} aria-current={pedidosAtivo ? "page" : undefined}>
                        <ClipboardList size={30} />
                        <h1>Pedidos</h1>
                    </button>
                </div>

                {ehEquipe && (
                    <div className={classeDoItem(adminAtivo)}>
                        <button onClick={() => navigate("/adm")} aria-current={adminAtivo ? "page" : undefined}>
                            <Gear size={30} />
                            <h1>Admin</h1>
                        </button>
                    </div>
                )}
            </div>
        </footer>
    )
}
