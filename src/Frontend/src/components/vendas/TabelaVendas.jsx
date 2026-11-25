import { useState } from "react";
import { FILTROS, STATUS, brl, soma } from "../JavaScript/vendasUtils";

const POR_PAGINA = 10;

// Lista das vendas do período, com filtro por status, totais e "Mostrar mais".
// Use key={periodo+início} no pai para voltar a mostrar só as 10 primeiras ao trocar de período.
export default function TabelaVendas({ vendas, filtro, onFiltro }) {
  const [limite, setLimite] = useState(POR_PAGINA);

  const contagem = (valor) => (valor === "todas" ? vendas.length : vendas.filter((v) => v.status === valor).length);
  const lista = filtro === "todas" ? vendas : vendas.filter((v) => v.status === filtro);
  const visiveis = lista.slice(0, limite);
  const faltam = lista.length - visiveis.length;

  function escolherFiltro(valor) {
    onFiltro(valor);
    setLimite(POR_PAGINA);
  }

  return (
    <>
      <div className="rounded-xl bg-white shadow">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4">
          <p className="font-bold">Vendas do período</p>

          <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por status">
            {FILTROS.map(({ valor, nome }) => (
              <button
                key={valor}
                onClick={() => escolherFiltro(valor)}
                aria-pressed={filtro === valor}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                  filtro === valor
                    ? "border-emerald-950 bg-emerald-950 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {nome} ({contagem(valor)})
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-180 text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Pedido</th>
                <th className="px-4 py-3 font-medium">Cliente</th>
                <th className="px-4 py-3 font-medium">Data</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Valor do pedido</th>
                <th className="px-4 py-3 text-right font-medium">Valor recebido</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 font-normal">
              {visiveis.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-semibold text-emerald-700">{v.num}</td>
                  <td className="px-4 py-3">{v.cliente}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {v.data.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" })}{" "}
                    {v.data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS[v.status].classe}`}>
                      {STATUS[v.status].texto}
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-right ${v.status === "cancelado" ? "text-slate-400 line-through" : ""}`}>
                    {brl(v.valor)}
                  </td>
                  <td className={`px-4 py-3 text-right font-semibold ${v.status === "aprovado" ? "text-emerald-700" : "text-slate-400"}`}>
                    {v.status === "aprovado" ? brl(v.recebido) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>

            {lista.length > 0 && (
              <tfoot className="border-t-2 border-slate-200 bg-slate-50">
                <tr>
                  <td className="px-4 py-3 font-bold" colSpan={4}>
                    Total do período{filtro === "todas" ? "" : " (filtro aplicado)"} · {lista.length}{" "}
                    {lista.length === 1 ? "pedido" : "pedidos"}
                  </td>
                  {/* cancelados não entram nos totais */}
                  <td className="px-4 py-3 text-right font-bold">
                    {brl(soma(lista.filter((v) => v.status !== "cancelado"), "valor"))}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-emerald-700">{brl(soma(lista, "recebido"))}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {lista.length === 0 && (
          <p className="py-12 text-center text-sm font-normal text-slate-500">Nenhuma venda neste período.</p>
        )}

        {faltam > 0 && (
          <div className="border-t border-slate-100 p-3 text-center">
            <button
              onClick={() => setLimite((l) => l + POR_PAGINA)}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Mostrar mais ({faltam} restantes)
            </button>
          </div>
        )}
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Só pedidos com pagamento aprovado entram em "recebido". Pedidos cancelados aparecem na lista, mas não entram nos totais.
      </p>
    </>
  );
}