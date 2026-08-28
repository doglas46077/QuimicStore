import { ArrowLeft } from 'reicon-react';



export default function HeaderPedidoStatus() {
    return (
        <header className="flex items-center justify-between gap-6 bg-emerald-950 px-6 py-3">
            <div className="flex items-center gap-2 text-lg font-bold">
                <span className="text-white">Quimic</span>
                <span className="text-amber-400">Store</span>
            </div>
            <div className='flex justify-center w-25 gap-1 text-white bg-gray-400 p-1 rounded-xl hover:scale-105 hover:duration-300'>
                <ArrowLeft size={24} />
                <h3>Loja</h3>
            </div>
        </header>
    );
}