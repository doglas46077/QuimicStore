import { CartLarge5 } from 'reicon-react';

const API_BASE = "http://localhost:8000"

function resolverImagem(imagem) {
    if (!imagem) return null
    if (/^(https?:|data:|blob:)/.test(imagem)) return imagem
    if (!imagem.includes(".") && imagem.length > 100) return `data:image/jpeg;base64,${imagem}`
    return `${API_BASE}/${imagem.replace(/^\/+/, "")}`
}

export default function CardCatalogo({nome, descricao, preco, imagem, alt, categoria}) {
    const src = resolverImagem(imagem)
    const precoFormatado = Number(preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })

    return (
        <div className="flex flex-col w-[95%] h-110 bg-white rounded-xl shadow items-center gap-3 hover:scale-105 hover:transition hover:duration-300">
            <div className="bg-gray-500 w-[90%] h-[45%] mt-3 rounded-xl overflow-hidden">
                {src && <img className='w-full h-full object-cover' src={src} alt={alt || nome} />}
            </div>
            <div className="flex flex-col items-baseline w-[90%]">
                <p className="text-emerald-700 text-2xl">{categoria}</p>
                <div className="" >
                    <h1 className='text-3xl'>{nome}</h1>
                    <p className="flex justify-baseline">{descricao}</p>
                </div>
            </div>
            <div className="flex w-[90%] justify-between items-center mt-[10%] lg:mt-[18%] md:mt-[15%]">
                <h1 className='text-2xl'>R$ {precoFormatado}</h1>
                <button className='flex justify-center p-1 rounded-full w-30 border-3 border-emerald-700 hover:bg-emerald-700 hover:text-white'>
                    <CartLarge5 size={24} />
                    <p>Adicionar</p>
                </button>
            </div>
        </div>
    );
}