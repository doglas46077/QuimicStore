import { CartLarge5 } from 'reicon-react';

export default function CardCatalogo({nome, descricao, preco, imagem, alt, categoria}) {
    return (
        <div className="flex flex-col w-[95%] h-110 bg-white rounded-xl shadow items-center gap-3 hover:scale-105 hover:transition hover:duration-300">
            <div className="bg-gray-500 w-[90%] h-[45%] mt-3 rounded-xl">
                <img className='w-full h-full' src={imagem} alt={alt} />
                
            </div>
            <div className="flex flex-col items-baseline w-[90%]">
                <p className="text-emerald-700 text-2xl">{categoria}</p>
                <div className="" >
                    <h1 className='text-3xl'>{nome}</h1>
                    <p className="flex justify-baseline">{descricao}</p>
                </div>
            </div>
            <div className="flex w-[90%] justify-between items-center mt-[10%] lg:mt-[18%] md:mt-[15%]">
                <h1 className='text-2xl'>R$ {preco}</h1>
                <button className='flex justify-center p-1 rounded-full w-30 border-3 border-emerald-700 hover:bg-emerald-700 hover:text-white'>
                    <CartLarge5 size={24} />
                    <p>Adicionar</p>
                </button>
            </div>
        </div>
    );
}