import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { API_URL } from "../api";
import { inicioDoDia, intervalo, moverAncora, normalizarVendas, rotuloDoPeriodo } from "../JavaScript/vendasUtils";
import SeletorPeriodo from "./SeletorPeriodo";
import NavegacaoPeriodo from "./NavegacaoPeriodo";
import ResumoVendas from "./ResumoVenda";
import GraficoVendas from "./GraficoVenda";
import TabelaVendas from "./TabelaVendas";

// Tela de vendas do admin. Busca os pedidos em GET /mostrar-pedidos (professor/estagiário).
export default function TelaVendas({ onVoltar, onSessaoExpirada }) {
  const [vendas, setVendas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [hoje] = useState(() => inicioDoDia());
  const [periodo, setPeriodo] = useState("mes");
  const [ancora, setAncora] = useState(hoje);
  const [filtro, setFiltro] = useState("todas");

  useEffect(() => {
    async function carregar() {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${API_URL}/mostrar-pedidos`, {
          headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
        });

        if (response.status === 401) {
          onSessaoExpirada();
          return;
        }

        const dados = await response.json().catch(() => ({}));

        if (!response.ok) {
          setErro(dados.message || "Não foi possível carregar as vendas");
          return;
        }

        setVendas(normalizarVendas(Array.isArray(dados.dados) ? dados.dados : []));
      } catch {
        setErro("Não foi possível conectar ao servidor");
      } finally {
        setCarregando(false);
      }
    }

    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const faixa = intervalo(periodo, ancora);
  const [inicio, fim] = faixa;

  const doPeriodo = vendas.filter((v) => v.data >= inicio && v.data < fim);
  const pagas = doPeriodo.filter((v) => v.status === "aprovado");
  const pendentes = doPeriodo.filter((v) => v.status === "pendente");
  const cancelados = doPeriodo.filter((v) => v.status === "cancelado");

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onVoltar}
            className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <ChevronLeft className="h-4 w-4" />
            Produtos
          </button>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">Vendas</h1>
            <p className="text-sm font-normal text-slate-500">Acompanhe o que entrou na loja</p>
          </div>
        </div>

        <SeletorPeriodo periodo={periodo} onMudar={setPeriodo} />
      </div>

      {erro && <p className="mb-4 text-sm text-red-600">{erro}</p>}

      {carregando ? (
        <p className="py-12 text-center text-sm font-normal text-slate-500">Carregando vendas...</p>
      ) : (
        !erro && (
          <>
            <NavegacaoPeriodo
              rotulo={rotuloDoPeriodo(periodo, faixa)}
              podeAvancar={fim <= hoje}
              ehAtual={inicio <= hoje && hoje < fim}
              onAnterior={() => setAncora(moverAncora(periodo, ancora, -1))}
              onProximo={() => setAncora(moverAncora(periodo, ancora, 1))}
              onAtual={() => setAncora(hoje)}
            />

            <ResumoVendas pagas={pagas} pendentes={pendentes} cancelados={cancelados} />
            <GraficoVendas periodo={periodo} faixa={faixa} pagas={pagas} />
            <TabelaVendas
              key={`${periodo}-${inicio.getTime()}`}
              vendas={doPeriodo}
              filtro={filtro}
              onFiltro={setFiltro}
            />
          </>
        )
      )}
    </section>
  );
}
