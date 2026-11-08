import { brl, montarBaldes } from "../JavaScript/vendasUtils";

function compacto(valor) {
  return valor >= 1000 ? `${(valor / 1000).toFixed(1).replace(".", ",")} mil` : String(Math.round(valor));
}

// Gráfico de barras do valor recebido (por dia na semana/mês, por mês no ano)
export default function GraficoVendas({ periodo, faixa, pagas }) {
  const baldes = montarBaldes(periodo, faixa, pagas);
  const maximo = Math.max(...baldes.map((b) => b.valor), 0);
  const mostrarValor = baldes.length <= 12;
  const por = periodo === "ano" ? "por mês" : "por dia";

  // no mês, só alguns dias aparecem no eixo para não amontoar
  const mostrarRotulo = (i) => periodo !== "mes" || i === 0 || (i + 1) % 5 === 0 || i === baldes.length - 1;

  return (
    <div className="mb-4 rounded-xl bg-white p-5 shadow">
      <div className="mb-3 flex items-baseline justify-between">
        <p className="font-bold">
          Valor recebido <span className="font-normal text-slate-500">{por}</span>
        </p>
        <p className="text-xs text-slate-500">{maximo ? `Maior barra: ${brl(maximo)}` : ""}</p>
      </div>

      <div role="img" aria-label={`Gráfico de valor recebido ${por}`} className="flex h-48 items-end gap-1">
        {baldes.map((b) => {
          const altura = maximo ? Math.max((b.valor / maximo) * 100, b.valor > 0 ? 2 : 0) : 0;
          const dica = `${b.rotulo}: ${brl(b.valor)} (${b.qtd} ${b.qtd === 1 ? "venda paga" : "vendas pagas"})`;

          return (
            <div key={b.rotulo} title={dica} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end">
              {mostrarValor && b.valor > 0 && (
                <span className="mb-0.5 text-[10px] text-slate-500">{compacto(b.valor)}</span>
              )}
              <div
                className="w-full rounded-t bg-emerald-600 transition-[height] duration-300 hover:bg-emerald-800 motion-reduce:transition-none"
                style={{ height: `${altura}%` }}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-1 flex gap-1 text-[11px] text-slate-500">
        {baldes.map((b, i) => (
          <span key={b.rotulo} className="min-w-0 flex-1 text-center">
            {mostrarRotulo(i) ? b.rotulo : ""}
          </span>
        ))}
      </div>
    </div>
  );
}