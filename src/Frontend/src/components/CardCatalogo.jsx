import { useRef, useState } from 'react';
import { arc, motion, useAnimate, useMotionValue, useReducedMotion } from 'motion/react';
import { CartLarge5 } from 'reicon-react';
import { cesta } from './CestaCarrinho';
import { resolverUrlImagem } from '../api';

export function resolverImagem(imagem) {
    return resolverUrlImagem(imagem)
}

const VOO = {
    strength: 0.5,
    peak: 0.15,
    rotate: 0.9,
    duration: 0.45,
    basketVelocityFactor: 0.05,
    direction: "cw", // "auto" | "cw" | "ccw"
}

export default function CardCatalogo({ nome, descricao, preco, imagem, alt, categoria, estoque, podeAdicionar, onAdicionar, onAbrir }) {
    const [scope, animate] = useAnimate()
    const imagemRef = useRef(null)
    const produtoX = useMotionValue(0)
    const produtoY = useMotionValue(0)
    const reduzirMovimento = useReducedMotion()

    const [voando, setVoando] = useState(false)
    const [aviso, setAviso] = useState("")

    const src = resolverImagem(imagem)
    const precoFormatado = Number(preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })
    const esgotado = estoque !== undefined && Number(estoque) <= 0

    function mostrarAviso(texto) {
        setAviso(texto)
        setTimeout(() => setAviso(""), 1500)
    }

    async function adicionar() {
        if (voando) return

        if (!podeAdicionar()) {
            mostrarAviso("Limite")
            return
        }

        const produto = imagemRef.current
        const { basket, ring } = cesta

        if (reduzirMovimento || !produto || !basket || !ring) {
            onAdicionar()
            mostrarAviso("Adicionado")
            return
        }

        setVoando(true)

        const from = produto.getBoundingClientRect()
        const to = basket.getBoundingClientRect()

        const card = scope.current
        const k = card.getBoundingClientRect().width / card.offsetWidth

        const dx = (to.left + to.width / 2 - (from.left + from.width / 2)) / k
        const dy = (to.top + to.height / 2 - (from.top + from.height / 2)) / k
        const escala = Math.min(to.width / from.width, to.height / from.height) / k

        await animate(
            produto,
            { x: dx, y: dy, scale: escala, opacity: [1, 1, 0] },
            {
                duration: VOO.duration,
                path: arc({
                    strength: VOO.strength,
                    peak: VOO.peak,
                    rotate: VOO.rotate,
                    direction: VOO.direction === "auto" ? undefined : VOO.direction,
                }),
                ease: [0.74, 0.18, 0.93, 0.69],
                opacity: { inherit: true, times: [0, 0.95, 1] },
            },
        )

        const vx = produtoX.getVelocity() * VOO.basketVelocityFactor
        const vy = produtoY.getVelocity() * VOO.basketVelocityFactor

        onAdicionar()
        mostrarAviso("Adicionado")

        animate(
            basket,
            { x: 0, y: 0 },
            {
                type: "spring",
                stiffness: 500,
                damping: 12,
                x: { inherit: true, velocity: vx },
                y: { inherit: true, velocity: vy },
            },
        )

        animate(
            ring,
            { scale: [1, 2.2], opacity: [0.8, 0] },
            { duration: 0.5, ease: "easeOut" },
        )

        
        animate(
            produto,
            { x: 0, y: 0, scale: 0.9, rotate: 0, opacity: 0 },
            { duration: 0 },
        )

        await animate(
            produto,
            { opacity: 1, scale: 1 },
            {
                scale: { type: "spring", visualDuration: 0.4, bounce: 0.35 },
                opacity: { duration: 0.25, ease: "easeOut" },
            },
        )

        setVoando(false)
    }

    return (
        <div
            ref={scope}
            role="link"
            tabIndex={0}
            onClick={onAbrir}
            onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    onAbrir?.()
                }
            }}
            className={`flex flex-col w-[95%] h-110 bg-white rounded-xl shadow items-center gap-3 pb-4 hover:scale-105 hover:transition hover:duration-300 cursor-pointer ${voando ? "relative z-60" : ""}`}
        >
            <motion.div
                ref={imagemRef}
                style={{ x: produtoX, y: produtoY, willChange: "transform, opacity" }}
                className="bg-gray-500 w-[90%] h-[45%] mt-3 rounded-xl overflow-hidden"
            >
                {src && <img className='w-full h-full object-cover' src={src} alt={alt || nome} />}
            </motion.div>
            <div className="flex flex-col items-baseline w-[90%]">
                <p className="text-emerald-700 text-lg">{categoria}</p>
                <div className="" >
                    <h1 className='text-3xl'>{nome}</h1>
                    <p className="flex justify-baseline font-normal">{descricao}</p>
                </div>
            </div>
            <div className="flex w-[90%] justify-between items-center mt-auto">
                <h1 className='text-2xl'>R$ {precoFormatado}</h1>
                <button
                    onClick={(event) => { event.stopPropagation(); adicionar() }}
                    disabled={esgotado || voando}
                    title={aviso === "Limite" ? "Você já adicionou todo o estoque disponível" : undefined}
                    className='flex justify-center p-1 rounded-full w-30 border-3 border-emerald-700 hover:bg-emerald-700 hover:text-white disabled:opacity-50 disabled:pointer-events-none'
                >
                    <CartLarge5 size={24} />
                    <p>{esgotado ? "Esgotado" : aviso || "Adicionar"}</p>
                </button>
            </div>
        </div>
    );
}
