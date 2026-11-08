import { ChevronLeft, ChevronRight } from "lucide-react";

// Setas para ir ao período anterior/próximo + atalho "Período atual"
export default function NavegacaoPeriodo({ rotulo, podeAvancar, ehAtual, onAnterior, onProximo, onAtual }) {
  const botaoSeta =
    "flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className="mb-4 flex items-center justify-center gap-2">
      <button onClick={onAnterior} aria-label="Período anterior" className={botaoSeta}>
        <ChevronLeft className="h-4 w-4" />
      </button>

      <p className="min-w-55 text-center text-lg font-bold" aria-live="polite">
        {rotulo}
      </p>

      <button onClick={onProximo} disabled={!podeAvancar} aria-label="Próximo período" className={botaoSeta}>
        <ChevronRight className="h-4 w-4" />
      </button>

      <button
        onClick={onAtual}
        className={`ml-1 rounded-lg px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 ${ehAtual ? "invisible" : ""}`}
      >
        Período atual
      </button>
    </div>
  );
}