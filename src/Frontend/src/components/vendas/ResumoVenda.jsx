import { brl, soma } from "../JavaScript/vendasUtils";

// Três cartões: total recebido, ticket médio e a receber
export default function ResumoVendas({ pagas, pendentes, cancelados }) {
  const recebido = soma(pagas, "recebido");
  const ticketMedio = pagas.length ? recebido / pagas.length : 0;

  return (
    <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
      <div className="rounded-xl bg-emerald-950 p-5 text-white shadow">
        <p className="text-sm text-emerald-200">Total recebido</p>
        <p className="mt-1 text-3xl font-bold">{brl(recebido)}</p>
        <p className="mt-1 text-xs text-emerald-200">
          {pagas.length} {pagas.length === 1 ? "venda paga" : "vendas pagas"}
        </p>
      </div>

      <div className="rounded-xl bg-white p-5 shadow">
        <p className="text-sm text-slate-500">Ticket médio</p>
        <p className="mt-1 text-3xl font-bold">{brl(ticketMedio)}</p>
        <p className="mt-1 text-xs text-slate-500">por venda paga</p>
      </div>

      <div className="rounded-xl bg-white p-5 shadow">
        <p className="text-sm text-slate-500">A receber</p>
        <p className="mt-1 text-3xl font-bold text-orange-600">{brl(soma(pendentes, "valor"))}</p>
        <p className="mt-1 text-xs text-slate-500">
          {pendentes.length} {pendentes.length === 1 ? "pendente" : "pendentes"} · {cancelados.length}{" "}
          {cancelados.length === 1 ? "cancelado" : "cancelados"}
        </p>
      </div>
    </div>
  );
}