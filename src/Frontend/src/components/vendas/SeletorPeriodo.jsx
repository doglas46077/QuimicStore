import { PERIODOS } from "../JavaScript/vendasUtils";

// Botões Semana / Mês / Ano
export default function SeletorPeriodo({ periodo, onMudar }) {
  return (
    <div className="flex rounded-xl bg-slate-100 p-1" role="group" aria-label="Período">
      {PERIODOS.map(({ valor, nome }) => (
        <button
          key={valor}
          onClick={() => onMudar(valor)}
          aria-pressed={periodo === valor}
          className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition ${
            periodo === valor ? "bg-white text-emerald-900 shadow" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          {nome}
        </button>
      ))}
    </div>
  );
}