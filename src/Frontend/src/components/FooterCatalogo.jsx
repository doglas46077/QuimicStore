import { Home3 } from 'reicon-react';
import { CartLarge5 } from 'reicon-react';
import { ClipboardList } from 'reicon-react';
import { Gear } from 'reicon-react';
import { useNavigate } from 'react-router-dom';

export default function FooterCatalogo() {
    const navigate = useNavigate()
    return (
        <footer className="h-20 bg-white mt-10">
            <div className="flex h-full justify-center items-center gap-[20%]">
                <div className='flex flex-col items-center p-2 hover:border-b-green-600 hover:border-b-3 hover:text-green-600 hover:transition hover:duration-200'>
                    <button onClick={() =>navigate("/catalogo")}>
                    <Home3 size={30} />
                    <h1>Início</h1>
                    </button>
                </div>

                <div className='flex flex-col items-center p-2 hover:border-b-emerald-700 hover:border-b-3 hover:text-emerald-700 hover:transition hover:duration-200'>
                    <button onClick={()=>navigate("/carrinho")}>
                    <CartLarge5 size={30} />
                    <h1>Carrinho</h1>
                    </button>
                </div>

                <div className='flex flex-col items-center p-2 hover:border-b-emerald-700 hover:border-b-3 hover:text-emerald-700 hover:transition hover:duration-200'>
                    <button onClick={()=> navigate("/pedidos")}>
                    <ClipboardList size={30} />
                    <h1>Pedidos</h1>
                    </button>
                </div>
                </div>
                
            
        </footer>
    )
}