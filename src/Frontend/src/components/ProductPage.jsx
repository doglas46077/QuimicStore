import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ShoppingCart, Star, Info, Minus, Plus, X } from "lucide-react";
import { arc, motion, useAnimate, useMotionValue, useReducedMotion } from "motion/react";
import HeaderLogin from "./Header/HeaderLogin";
import { useLocation, useNavigate } from "react-router-dom";
import { API_URL, resolverUrlImagem, imagensDoProduto } from "./api";
import FooterCatalogo from "./FooterCatalogo";
import { listaDeImagens } from "./CardCatalogo";
import { cesta } from "./CestaCarrinho";
import { useCarrinho } from "./JavaScript/carrinhoAnimacao";

export default function ProductPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const produto = state?.produto;
  const [scope, animate] = useAnimate();
  const imagemRef = useRef(null);
  const produtoX = useMotionValue(0);
  const produtoY = useMotionValue(0);
  const reduzirMovimento = useReducedMotion();
  const { adicionar, podeAdicionar } = useCarrinho();
  const [indice, setIndice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [adicionando, setAdicionando] = useState(false);
  const [aviso, setAviso] = useState("");

  const [avaliacoes, setAvaliacoes] = useState(null); // null = carregando
  const [erroAvaliacoes, setErroAvaliacoes] = useState(false);
  const [verTodas, setVerTodas] = useState(false);

  // Avaliações do produto (rota pública do back), as mais recentes primeiro
  useEffect(() => {
    if (!produto?.id) return;

    fetch(`${API_URL}/comentario/${produto.id}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(({ data }) => setAvaliacoes([...data].sort((a, b) => b.id - a.id)))
      .catch(() => setErroAvaliacoes(true));
  }, [produto?.id]);

  const lista = avaliacoes ?? [];
  const total = lista.length;
  const media = total ? lista.reduce((soma, a) => soma + Number(a.nota), 0) / total : 0;

  let mensagemAvaliacoes = "";
  if (erroAvaliacoes) mensagemAvaliacoes = "Não foi possível carregar as avaliações.";
  else if (produto?.id && avaliacoes === null) mensagemAvaliacoes = "Carregando avaliações...";
  else if (total === 0) mensagemAvaliacoes = "Este produto ainda não tem avaliações.";

  const stock = Number(produto?.estoque ?? 0);

  const imagens = imagensDoProduto(produto);
  const imagemAtual = imagens[indice] || imagens[0];
  const anterior = () => setIndice((i) => (i - 1 + imagens.length) % imagens.length);
  const proxima = () => setIndice((i) => (i + 1) % imagens.length);

  const quantidadeExibida = stock <= 0 ? 0 : quantity;
  const decrease = () => setQuantity((q) => Math.max(1, q - 1));
  const increase = () => setQuantity((q) => Math.min(stock, q + 1));
  const changeQuantity = (value) => {
    if (value === "") {
      setQuantity("");
      return;
    }
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return;
    setQuantity(Math.min(stock, Math.max(1, Math.floor(parsed))));
  };
  const normalizeQuantity = () => {
    const parsed = Number(quantity);
    setQuantity(stock > 0 && Number.isFinite(parsed) ? Math.min(stock, Math.max(1, Math.floor(parsed))) : 0);
  };

  function mostrarAviso(texto) {
    setAviso(texto);
    window.setTimeout(() => setAviso(""), 1500);
  }

  async function adicionarAoCarrinho() {
    if (!produto || adicionando) return;
    if (!podeAdicionar(produto, quantity)) {
      mostrarAviso("Limite");
      return;
    }

    const imagem = imagemRef.current;
    const { basket, ring } = cesta;
    if (reduzirMovimento || !imagem || !basket || !ring) {
      adicionar(produto, quantity);
      mostrarAviso("Adicionado");
      return;
    }

    setAdicionando(true);
    const from = imagem.getBoundingClientRect();
    const to = basket.getBoundingClientRect();
    const container = scope.current;
    const escalaContainer = container.getBoundingClientRect().width / container.offsetWidth;
    const dx = (to.left + to.width / 2 - (from.left + from.width / 2)) / escalaContainer;
    const dy = (to.top + to.height / 2 - (from.top + from.height / 2)) / escalaContainer;
    const escala = Math.min(to.width / from.width, to.height / from.height) / escalaContainer;

    await animate(imagem, { x: dx, y: dy, scale: escala, opacity: [1, 1, 0] }, {
      duration: 0.45,
      path: arc({ strength: 0.5, peak: 0.15, rotate: 0.9, direction: "cw" }),
      ease: [0.74, 0.18, 0.93, 0.69],
      opacity: { inherit: true, times: [0, 0.95, 1] },
    });

    const vx = produtoX.getVelocity() * 0.05;
    const vy = produtoY.getVelocity() * 0.05;
    adicionar(produto, quantity);
    mostrarAviso("Adicionado");
    animate(basket, { x: 0, y: 0 }, {
      type: "spring", stiffness: 500, damping: 12,
      x: { inherit: true, velocity: vx }, y: { inherit: true, velocity: vy },
    });
    animate(ring, { scale: [1, 2.2], opacity: [0.8, 0] }, { duration: 0.5, ease: "easeOut" });
    animate(imagem, { x: 0, y: 0, scale: 0.9, rotate: 0, opacity: 0 }, { duration: 0 });
    await animate(imagem, { opacity: 1, scale: 1 }, {
      scale: { type: "spring", visualDuration: 0.4, bounce: 0.35 },
      opacity: { duration: 0.25, ease: "easeOut" },
    });
    setAdicionando(false);
  }

  return (
    <div ref={scope} className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-24">
      {/* Header */}
      <HeaderLogin />

      <main className="mx-auto max-w-5xl px-6 py-6 sm:px-10">
        {/* Back button */}
        <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50">
          <ChevronLeft className="h-4 w-4" />
          Voltar
        </button>

        {/* Product card */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Image column */}
            <div>
              <div className="flex h-96 items-center justify-center rounded-xl bg-gray-50">
                <motion.div ref={imagemRef} style={{ x: produtoX, y: produtoY, willChange: "transform, opacity" }} className="flex h-full w-full items-center justify-center">
                  {imagemAtual ? (
                    <img src={resolverUrlImagem(imagemAtual)} alt={produto?.nome} className="h-full w-full rounded-xl object-contain" />
                  ) : (
                    <BottleIllustration className="h-72 w-auto" />
                  )}
                </motion.div>
              </div>

              {imagens.length > 0 && (
                <div className="mt-3 flex items-center gap-2">
                  {imagens.length > 1 && <button onClick={anterior} className="flex h-14 w-12 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50">
                    <ChevronLeft className="h-4 w-4" />
                  </button>}
                  {imagens.map((img, i) => (
                    <button
                      key={img}
                      onClick={() => setIndice(i)}
                      className={`flex h-14 flex-1 items-center justify-center rounded-lg border-2 bg-gray-50 p-1 transition ${
                        indice === i
                          ? "border-emerald-600"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img src={resolverUrlImagem(img)} alt="" className="h-full w-full object-contain" />
                    </button>
                  ))}
                  {imagens.length > 1 && <button onClick={proxima} className="flex h-14 w-12 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50">
                    <ChevronRight className="h-4 w-4" />
                  </button>}
                </div>
              )}
            </div>

            {/* Details column */}
            <div className="flex flex-col">
              <div className="flex items-start justify-between gap-4">
                <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                  {produto?.categoria || "Estética"}
                </span>
                <span className="whitespace-nowrap text-2xl font-bold text-emerald-800 sm:text-3xl">
                  R$ {Number(produto?.preco ?? 12).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>

              <h1 className="mt-3 text-3xl font-bold text-gray-900">{produto?.nome || "Shampoo Neutro"}</h1>

              <div className="mt-2 flex items-center gap-2">
                <EstrelasNota nota={Math.round(media)} tamanho="h-5 w-5" />
                <span className="text-sm font-medium text-emerald-700">
                  {total > 0 ? `${media.toFixed(1).replace(".", ",")} (${total} ${total === 1 ? "avaliação" : "avaliações"})` : "Sem avaliações"}
                </span>
              </div>

              <p className="mt-4 text-gray-600">
                {produto?.descricao || "Shampoo de fórmula neutra, suave para todos os tipos de cabelos. Fabricado pelos alunos com controle do pH para uso diário."}
              </p>

              <div className="mt-5 flex gap-3 rounded-xl bg-emerald-50 p-4">
                <Info className="mt-0.5 h-5 w-5 text-emerald-700" />
                <p className="text-sm leading-relaxed text-emerald-900">
                  Fabricado pelos alunos do curso Técnico de Química
                  <br />
                  Retirada presencial na FIEC
                </p>
              </div>

              <div className="mt-6">
                <p className="mb-2 font-semibold text-gray-900">Quantidade</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center overflow-hidden rounded-lg border border-gray-200">
                    <button
                      onClick={decrease}
                      disabled={stock <= 0}
                      className="flex h-11 w-11 items-center justify-center text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <input
                      type="number"
                      min={stock <= 0 ? 0 : 1}
                      max={stock}
                      step="1"
                      value={quantidadeExibida}
                      onChange={(event) => changeQuantity(event.target.value)}
                      onBlur={normalizeQuantity}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") event.currentTarget.blur();
                      }}
                      aria-label="Quantidade do produto"
                      className="h-11 w-14 border-x border-gray-200 text-center text-lg font-medium outline-none"
                    />
                    <button
                      onClick={increase}
                      disabled={stock <= 0}
                      className="flex h-11 w-11 items-center justify-center text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-emerald-700">{stock} em estoque</p>
                    <p className="text-gray-400">Estoque disponível</p>
                  </div>
                </div>
              </div>

              <button onClick={adicionarAoCarrinho} disabled={!produto || stock <= 0 || adicionando} title={aviso === "Limite" ? "Você já adicionou todo o estoque disponível" : undefined} className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-emerald-700 py-4 text-lg font-semibold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50">
                <ShoppingCart className="h-5 w-5" />
                {stock <= 0 ? "Esgotado" : aviso || "Adicionar ao carrinho"}
              </button>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50">
              <Star className="h-5 w-5 text-emerald-700" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Avaliações Recentes</h2>
          </div>

          {mensagemAvaliacoes && <p className="mt-4 text-sm text-gray-500">{mensagemAvaliacoes}</p>}

          <div className="mt-4 flex flex-col gap-3">
            {lista.slice(0, 3).map((a) => (
              <AvaliacaoCard key={a.id} avaliacao={a} />
            ))}
          </div>

          {total > 3 && (
            <button
              onClick={() => setVerTodas(true)}
              className="mt-4 w-full rounded-xl border border-emerald-200 bg-emerald-50 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100"
            >
              Ver avaliações ({total})
            </button>
          )}
        </div>
      </main>
      {verTodas && <ModalAvaliacoes avaliacoes={lista} onFechar={() => setVerTodas(false)} />}

      <FooterCatalogo />
    </div>
  );
}

function EstrelasNota({ nota, tamanho = "h-3.5 w-3.5" }) {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`${tamanho} fill-current ${i <= nota ? "text-amber-400" : "text-gray-200"}`} />
      ))}
    </div>
  );
}

// "Ana Paula Souza" -> "Ana S." (não expõe o nome completo do cliente)
function nomeCurto(nome) {
  const partes = (nome || "").trim().split(/\s+/);
  const inicialDoUltimo = partes.length > 1 ? ` ${partes.at(-1)[0].toUpperCase()}.` : "";
  return (partes[0] || "Cliente") + inicialDoUltimo;
}

function AvaliacaoCard({ avaliacao }) {
  const nome = nomeCurto(avaliacao.usuario?.nome);
  const data = new Date(avaliacao.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" });

  return (
    <div className="rounded-xl bg-gray-50 p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 font-semibold text-gray-600">
          {nome[0].toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{nome}</p>
          <div className="flex items-center gap-2">
            <EstrelasNota nota={Number(avaliacao.nota)} />
            <span className="text-xs text-gray-400">{data}</span>
          </div>
        </div>
      </div>
      {avaliacao.comentario && <p className="mt-3 break-words text-gray-700">"{avaliacao.comentario}"</p>}
    </div>
  );
}

function ModalAvaliacoes({ avaliacoes, onFechar }) {
  // fecha com Esc e trava a rolagem da página enquanto está aberto
  useEffect(() => {
    const fecharComEsc = (e) => e.key === "Escape" && onFechar();
    document.addEventListener("keydown", fecharComEsc);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", fecharComEsc);
      document.body.style.overflow = "";
    };
  }, [onFechar]);

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-emerald-950/50 px-3 py-4"
      onClick={(e) => e.target === e.currentTarget && onFechar()}
    >
      <div role="dialog" aria-modal="true" className="flex max-h-[90vh] w-full max-w-xl flex-col rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-4">
          <h2 className="text-xl font-bold text-gray-900">Avaliações ({avaliacoes.length})</h2>
          <button onClick={onFechar} aria-label="Fechar" className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-3 overflow-y-auto">
          {avaliacoes.map((a) => (
            <AvaliacaoCard key={a.id} avaliacao={a} />
          ))}
        </div>
      </div>
    </div>
  );
}

function BottleIllustration({ className = "", simple = false }) {
  return (
    <svg viewBox="0 0 160 260" className={className} xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="80" cy="250" rx="46" ry="8" fill="#00000010" />
      <rect x="70" y="10" width="20" height="18" rx="4" fill="#a8d5c4" stroke="#5fae8c" strokeWidth="2" />
      <rect x="60" y="26" width="40" height="14" rx="6" fill="#cfeadd" stroke="#5fae8c" strokeWidth="2" />
      <path
        d="M40 44 h80 a6 6 0 0 1 6 6 v170 a14 14 0 0 1 -14 14 H48 a14 14 0 0 1 -14 -14 V50 a6 6 0 0 1 6 -6 Z"
        fill="#7fd3b0"
        stroke="#4a9c78"
        strokeWidth="2.5"
      />
      <rect x="26" y="44" width="108" height="20" rx="6" fill="#5fae8c" stroke="#4a9c78" strokeWidth="2" />
      {!simple && (
        <>
          <rect x="42" y="110" width="76" height="86" rx="6" fill="#f4efe1" stroke="#c9c0a3" strokeWidth="1.5" />
          <text x="80" y="132" textAnchor="middle" fontSize="9" fontWeight="700" fill="#2f6b52">
            New Green
          </text>
          <text x="80" y="158" textAnchor="middle" fontSize="12" fontWeight="800" fill="#1f4d3a">
            SHAMPOO
          </text>
          <text x="80" y="172" textAnchor="middle" fontSize="12" fontWeight="800" fill="#1f4d3a">
            NEUTRO
          </text>
          <text x="80" y="190" textAnchor="middle" fontSize="7" fill="#5a7d6c">
            500ml
          </text>
        </>
      )}
      <rect x="46" y="200" width="68" height="46" rx="8" fill="#5fd0aa" opacity="0.7" />
    </svg>
  );
}
