import { useEffect, useMemo, useRef, useState } from "react";
import { API_URL } from "./api";
import { resolverImagem } from "./CardCatalogo";
const MAX = 500;

const SEM_RASCUNHO = { nota: 0, texto: "" };

function rotuloNota(n) {
    return n ? `${n} de 5 estrelas` : "Toque em uma estrela para avaliar";
}

// ---------------------------------------------------------------------------
// Estrelas
// ---------------------------------------------------------------------------
export function EstrelaSvg({ cheia, tam }) {
    return (
        <svg viewBox="0 0 24 24" width={tam} height={tam} aria-hidden="true">
            <polygon
                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                fill={cheia ? "#facc15" : "none"}
                stroke="#eab308"
                strokeWidth="1.6"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function EstrelasFixas({ nota, tam, className = "" }) {
    return (
        <div className={`flex ${className}`}>
            {[1, 2, 3, 4, 5].map((i) => (
                <span key={i} style={{ lineHeight: 0 }}>
                    <EstrelaSvg cheia={i <= nota} tam={tam} />
                </span>
            ))}
        </div>
    );
}

function EstrelasClicaveis({ valor, tam, onEscolher, desabilitado }) {
    const [previa, setPrevia] = useState(0); // prévia ao passar o mouse
    const mostrada = previa || valor;

    return (
        <div className="flex gap-2" onMouseLeave={() => setPrevia(0)}>
            {[1, 2, 3, 4, 5].map((i) => (
                <button
                    key={i}
                    type="button"
                    disabled={desabilitado}
                    aria-label={`${i} de 5 estrelas`}
                    onMouseEnter={() => setPrevia(i)}
                    onClick={() => onEscolher(i)}
                    className="cursor-pointer rounded-md p-0.5 leading-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
                >
                    <EstrelaSvg cheia={i <= mostrada} tam={tam} />
                </button>
            ))}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Formulário (estrelas + comentário + botão), usado na experiência e em cada produto
// ---------------------------------------------------------------------------
function FormAvaliacao({ pergunta, placeholder, tamEstrela, linhas, dados, enviando, erro, onNota, onTexto, onEnviar }) {
    const pronto = dados.nota > 0 && !enviando; // o comentário é opcional, a nota não

    return (
        <>
            <p className="text-sm font-bold">{pergunta}</p>

            <div className="mt-2 flex flex-col items-center">
                <EstrelasClicaveis valor={dados.nota} tam={tamEstrela} onEscolher={onNota} desabilitado={enviando} />
                <p className="mt-1 text-xs text-slate-600">{rotuloNota(dados.nota)}</p>
            </div>

            <p className="mt-4 text-sm font-bold">Deixe sua opinião</p>
            <textarea
                value={dados.texto}
                onChange={(e) => onTexto(e.target.value)}
                maxLength={MAX}
                rows={linhas}
                disabled={enviando}
                placeholder={placeholder}
                className="mt-2 w-full resize-none rounded-xl border border-slate-300 p-3 text-sm placeholder:text-slate-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
            />
            <p className="mt-1 text-right text-xs text-slate-500">
                {dados.texto.length}/{MAX} caracteres
            </p>

            {erro && <p className="mt-1 text-center text-xs text-red-600">{erro}</p>}

            <button
                type="button"
                disabled={!pronto}
                onClick={onEnviar}
                className={`mt-2 w-full rounded-full py-3 text-sm font-semibold transition ${
                    pronto
                        ? "cursor-pointer bg-emerald-950 text-white hover:bg-emerald-900"
                        : "cursor-not-allowed bg-slate-100 text-slate-400"
                }`}
            >
                {enviando ? "Enviando..." : "Enviar avaliação"}
            </button>
        </>
    );
}

function Miniatura({ src, tam }) {
    return (
        <div className={`${tam} shrink-0 overflow-hidden rounded-lg bg-zinc-300`}>
            {src && <img src={src} alt="" className="h-full w-full object-cover" />}
        </div>
    );
}

function mensagemDeErro(dados, padrao) {
    if (dados?.errors) {
        const primeira = Object.values(dados.errors).flat()[0];
        if (primeira) return primeira;
    }
    return dados?.message || padrao;
}

// ---------------------------------------------------------------------------
// Janela
// ---------------------------------------------------------------------------
// avaliacao = { experiencia: {nota, comentario} | null, produtos: [{produto_id, nota, comentario}], concluida: bool }
// onAtualizar recebe uma função (anterior) => novo, igual ao setState do componente pai
export default function ModalAvaliacaoPedido({ aberto, onFechar, pedido, avaliacao, onAtualizar, onSessaoExpirada }) {
    const [passo, setPasso] = useState(() =>
        avaliacao.concluida ? "fim" : avaliacao.experiencia || avaliacao.produtos.length > 0 ? "produtos" : "experiencia"
    );
    const [rascunhos, setRascunhos] = useState({});
    const [enviando, setEnviando] = useState(null);
    const [erros, setErros] = useState({});
    const tituloRef = useRef(null);

    // produtos do pedido, sem repetir
    const produtos = useMemo(() => {
        const vistos = new Set();
        const lista = [];
        for (const item of pedido?.itens || []) {
            if (vistos.has(item.produto_id)) continue;
            vistos.add(item.produto_id);
            lista.push({
                id: item.produto_id,
                nome: item.produto?.nome || `Produto #${item.produto_id}`,
                src: resolverImagem(item.produto?.imagens),
            });
        }
        return lista;
    }, [pedido]);

    const doProduto = (id) => avaliacao.produtos.find((p) => String(p.produto_id) === String(id));
    const avaliados = produtos.filter((p) => doProduto(p.id)).length;

    const rascunho = (g) => rascunhos[g] ?? SEM_RASCUNHO;
    const mudarRascunho = (g, parte) =>
        setRascunhos((r) => ({ ...r, [g]: { ...(r[g] ?? SEM_RASCUNHO), ...parte } }));

    // trava a rolagem da página e fecha com Esc
    useEffect(() => {
        if (!aberto) return;

        const overflowAnterior = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const aoTeclar = (e) => {
            if (e.key === "Escape") onFechar();
        };
        document.addEventListener("keydown", aoTeclar);

        return () => {
            document.body.style.overflow = overflowAnterior;
            document.removeEventListener("keydown", aoTeclar);
        };
    }, [aberto, onFechar]);

    // leva o foco para o título ao abrir e a cada etapa
    useEffect(() => {
        if (aberto) tituloRef.current?.focus({ preventScroll: true });
    }, [aberto, passo]);

    async function enviar(g) {
        const d = rascunho(g);
        if (d.nota < 1 || enviando) return;

        const comentario = d.texto.trim() || null;

        // Experiência: o back não tem rota para isso, fica salva no navegador
        if (g === "exp") {
            onAtualizar((a) => ({ ...a, experiencia: { nota: d.nota, comentario } }));
            setPasso("produtos");
            return;
        }

        // Produto: usa a rota que já existe
        const produtoId = Number(g.slice(1));

        setEnviando(g);
        setErros((e) => ({ ...e, [g]: "" }));

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`${API_URL}/registrar-comentario/${produtoId}`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ nota: d.nota, comentario }),
            });

            if (response.status === 401) {
                onSessaoExpirada?.();
                return;
            }

            const dados = await response.json().catch(() => ({}));

            if (response.ok) {
                onAtualizar((a) => ({
                    ...a,
                    produtos: [...a.produtos, { produto_id: produtoId, nota: d.nota, comentario }],
                }));
            } else {
                setErros((e) => ({ ...e, [g]: mensagemDeErro(dados, "Não foi possível enviar a avaliação") }));
            }
        } catch {
            setErros((e) => ({ ...e, [g]: "Não foi possível conectar ao servidor" }));
        } finally {
            setEnviando(null);
        }
    }

    // "Concluir" só marca o pedido como avaliado (guardado no navegador)
    function concluir() {
        onAtualizar((a) => ({ ...a, concluida: true }));
        setPasso("fim");
    }

    if (!aberto) return null;

    function cabecalho(titulo, sub) {
        return (
            <>
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h2 id="titulo-avaliacao" ref={tituloRef} tabIndex={-1} className="text-2xl font-bold outline-none">
                            {titulo}
                        </h2>
                        <p className="mt-1 text-sm font-light text-slate-600">{sub}</p>
                    </div>
                    <button
                        type="button"
                        onClick={onFechar}
                        aria-label="Fechar"
                        className="cursor-pointer rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                            <path d="M6 6l12 12M18 6L6 18" />
                        </svg>
                    </button>
                </div>
                <hr className="my-4 border-slate-100" />
            </>
        );
    }

    function cartaoProduto(p) {
        const enviada = doProduto(p.id);
        const g = "p" + p.id;

        if (enviada) {
            return (
                <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-3">
                    <Miniatura src={p.src} tam="h-12 w-12" />
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{p.nome}</p>
                        <EstrelasFixas nota={enviada.nota} tam={16} className="mt-0.5" />
                    </div>
                    <span className="shrink-0 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
                        Avaliação enviada
                    </span>
                </div>
            );
        }

        return (
            <div className="rounded-2xl border border-slate-200 p-4">
                <div className="mb-3 flex items-center gap-3">
                    <Miniatura src={p.src} tam="h-12 w-12" />
                    <p className="text-sm font-semibold">{p.nome}</p>
                </div>
                <FormAvaliacao
                    pergunta="Como você avalia este produto?"
                    placeholder="Conte o que achou do produto..."
                    tamEstrela={26}
                    linhas={2}
                    dados={rascunho(g)}
                    enviando={enviando === g}
                    erro={erros[g]}
                    onNota={(n) => mudarRascunho(g, { nota: n })}
                    onTexto={(t) => mudarRascunho(g, { texto: t })}
                    onEnviar={() => enviar(g)}
                />
            </div>
        );
    }

    let conteudo;

    if (passo === "experiencia") {
        conteudo = (
            <>
                {cabecalho("Avalie sua experiência", "Sua opinião é importante para nós!")}
                <FormAvaliacao
                    pergunta="Como você avalia sua experiência com a QuimicStore?"
                    placeholder="Conte como foi comprar na QuimicStore..."
                    tamEstrela={28}
                    linhas={4}
                    dados={rascunho("exp")}
                    enviando={enviando === "exp"}
                    erro={erros.exp}
                    onNota={(n) => mudarRascunho("exp", { nota: n })}
                    onTexto={(t) => mudarRascunho("exp", { texto: t })}
                    onEnviar={() => enviar("exp")}
                />
                <p className="mt-3 text-center text-xs text-slate-500">Sua avaliação ajuda a melhorar a QuimicStore.</p>
                <button
                    type="button"
                    onClick={() => setPasso("produtos")}
                    className="mx-auto mt-2 block cursor-pointer text-xs font-semibold text-slate-500 underline hover:text-slate-700"
                >
                    Pular esta etapa
                </button>
            </>
        );
    } else if (passo === "produtos") {
        conteudo = (
            <>
                {cabecalho("Avalie os produtos", "Conte o que achou de cada produto do seu pedido.")}

                {avaliacao.experiencia && (
                    <p className="mb-3 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800">
                        Obrigado! Sua avaliação da experiência foi enviada.
                    </p>
                )}

                <p className="mb-3 text-xs font-semibold text-slate-500">
                    {avaliados} de {produtos.length} produtos avaliados
                </p>

                <div className="flex flex-col gap-3">
                    {produtos.map((p) => (
                        <div key={p.id}>{cartaoProduto(p)}</div>
                    ))}
                </div>

                <button
                    type="button"
                    onClick={concluir}
                    disabled={!!enviando}
                    className="mt-5 w-full cursor-pointer rounded-full bg-emerald-950 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {avaliados === produtos.length ? "Concluir" : "Concluir sem avaliar todos"}
                </button>
                <p className="mt-2 text-center text-xs text-slate-500">Você pode avaliar só os produtos que quiser.</p>
            </>
        );
    } else {
        conteudo = (
            <div className="flex flex-col items-center py-6 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-green-700 bg-white">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M5 12.5l4.2 4.2L19 7" />
                    </svg>
                </span>
                <h2 id="titulo-avaliacao" ref={tituloRef} tabIndex={-1} className="mt-4 text-2xl font-bold outline-none">
                    Obrigado pela avaliação!
                </h2>
                <p className="mt-1 text-sm font-light text-slate-600">
                    Suas opiniões ajudam a melhorar a QuimicStore e os nossos produtos.
                </p>
                <button
                    type="button"
                    onClick={onFechar}
                    className="mt-6 w-full cursor-pointer rounded-full bg-emerald-950 py-3 text-sm font-semibold text-white hover:bg-emerald-900"
                >
                    Fechar
                </button>
            </div>
        );
    }

    return (
        <div
            className="fixed inset-0 z-40 flex items-center justify-center bg-emerald-950/50 px-3 py-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) onFechar();
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="titulo-avaliacao"
                className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl"
            >
                {conteudo}
            </div>
        </div>
    );
}