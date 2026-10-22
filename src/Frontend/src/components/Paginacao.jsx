function numerosDaPagina(atual, ultima) {
    const unicas = new Set([1, ultima, atual - 1, atual, atual + 1])
    const lista = [...unicas].filter((n) => n >= 1 && n <= ultima).sort((a, b) => a - b)

    const resultado = []
    lista.forEach((n, i) => {
        if (i > 0 && n - lista[i - 1] > 1) resultado.push(`…${n}`) 
        resultado.push(n)
    })
    return resultado
}

export default function Paginacao({ paginaAtual, ultimaPagina, total, onMudar, desabilitado = false }) {
    const botao = "flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm shadow transition"
    const comum = "bg-white hover:bg-emerald-950 hover:text-white"
    const inativo = "disabled:pointer-events-none disabled:opacity-40"

    return (
        <nav aria-label="Paginação" className="flex w-[80%] flex-col items-center gap-3">
            <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                    type="button"
                    onClick={() => onMudar(paginaAtual - 1)}
                    disabled={paginaAtual <= 1 || desabilitado}
                    className={`${botao} ${comum} ${inativo}`}
                >
                    Anterior
                </button>

                {numerosDaPagina(paginaAtual, ultimaPagina).map((item) =>
                    typeof item === "string" ? (
                        <span key={item} className="px-1 text-slate-400">…</span>
                    ) : (
                        <button
                            key={item}
                            type="button"
                            onClick={() => onMudar(item)}
                            disabled={desabilitado}
                            aria-current={item === paginaAtual ? "page" : undefined}
                            className={`${botao} ${inativo} ${
                                item === paginaAtual ? "bg-emerald-950 text-white" : comum
                            }`}
                        >
                            {item}
                        </button>
                    )
                )}

                <button
                    type="button"
                    onClick={() => onMudar(paginaAtual + 1)}
                    disabled={paginaAtual >= ultimaPagina || desabilitado}
                    className={`${botao} ${comum} ${inativo}`}
                >
                    Próxima
                </button>
            </div>

            <p className="text-xs font-normal text-slate-500">
                Página {paginaAtual} de {ultimaPagina} · {total} {total === 1 ? "produto" : "produtos"}
            </p>
        </nav>
    )
}