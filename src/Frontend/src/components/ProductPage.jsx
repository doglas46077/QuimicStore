import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ShoppingCart, Star, Info, Minus, Plus, FlaskConical } from "lucide-react";
import { arc, motion, useAnimate, useMotionValue, useReducedMotion } from "motion/react";
import HeaderLogin from "./Header/HeaderLogin";
import { useLocation, useNavigate } from "react-router-dom";
import { resolverUrlImagem } from "./api";
import FooterCatalogo from "./FooterCatalogo";
import { cesta } from "./CestaCarrinho";
import { useCarrinho } from "./JavaScript/carrinhoAnimacao";

const THUMBS = [
  { id: 1, label: "frente" },
  { id: 2, label: "verso" },
  { id: 3, label: "válvula" },
];

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
  const [activeThumb, setActiveThumb] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [adicionando, setAdicionando] = useState(false);
  const [aviso, setAviso] = useState("");
  const stock = Number(produto?.estoque ?? 0);

  const decrease = () => setQuantity((q) => Math.max(1, q - 1));
  const increase = () => setQuantity((q) => Math.min(stock, q + 1));

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
                  {produto?.imagem ? <img src={resolverUrlImagem(produto.imagem)} alt={produto.nome} className="h-full w-full rounded-xl object-contain" /> : <BottleIllustration className="h-72 w-auto" />}
                </motion.div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <button className="flex h-14 w-12 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {THUMBS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveThumb(t.id)}
                    className={`flex h-14 flex-1 items-center justify-center rounded-lg border-2 bg-gray-50 p-1 transition ${
                      activeThumb === t.id
                        ? "border-emerald-600"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {produto?.imagem ? <img src={resolverUrlImagem(produto.imagem)} alt="" className="h-full w-full object-contain" /> : <BottleIllustration className="h-11 w-auto" simple />}
                  </button>
                ))}
                <button className="flex h-14 w-12 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Details column */}
            <div className="flex flex-col">
              <div className="flex items-start justify-between gap-4">
                <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                  Estética
                </span>
                <span className="whitespace-nowrap text-2xl font-bold text-emerald-800 sm:text-3xl">
                  R$ {Number(produto?.preco ?? 12).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>

              <h1 className="mt-3 text-3xl font-bold text-gray-900">{produto?.nome || "Shampoo Neutro"}</h1>

              <div className="mt-2 flex items-center gap-2">
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <span className="text-sm font-medium text-emerald-700">(14 avaliações)</span>
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
                      className="flex h-11 w-11 items-center justify-center text-gray-600 hover:bg-gray-50"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="flex h-11 w-14 items-center justify-center border-x border-gray-200 text-lg font-medium">
                      {quantity}
                    </span>
                    <button
                      onClick={increase}
                      className="flex h-11 w-11 items-center justify-center text-gray-600 hover:bg-gray-50"
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

          <div className="mt-4 rounded-xl bg-gray-50 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 font-semibold text-gray-600">
                A
              </div>
              <div>
                <p className="font-semibold text-gray-900">ANA.P</p>
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">20/04/26</span>
                </div>
              </div>
            </div>
            <p className="mt-3 text-gray-700">"Ótimo produto! Deixou meu cabelo muito hidratado."</p>
          </div>
        </div>
      </main>
      <FooterCatalogo />
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
