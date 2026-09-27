import HeaderPedidoStatus from "./Header/HeaderPedido";
import FooterCatalogo from "./FooterCatalogo";
import { ClockCircle } from 'reicon-react';
import { Calendar } from 'reicon-react';

export default function SectionPedidoDetalhes() {
    return (
        <main className="flex flex-col justify-between min-h-screen ">
            <HeaderPedidoStatus />
            <div className="flex justify-between">
                <div className="flex gap-7 justify-center items-center w-[30%]">
                    <div className="bg-yellow-200 text-yellow-500 rounded-full p-4">
                        <ClockCircle size={54} />
                    </div>
                    <div>
                        <p>Pedido #QS-2026-0042</p>
                        <p>Realizado em 08/04/26 ás 14:32</p>
                    </div>                    
                </div>

                <div className="flex flex-col justify-center items-center w-[30%]">
                    <div>
                        <p className="bg-zinc-500 p-2 rounded-2xl">Status</p>
                    </div>
                    <div>
                        <p>Seu pedido está sendo preparado</p>
                        <div className="flex gap-2 items-center">
                            <p>Data de retirada:</p>
                            <p className="text-lg text-emerald-700">00/00/0000</p>
                            <Calendar size={24} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col justify-center items-center">
                <div className="flex justify-center items-center bg-amber-400 h-50 w-[90%]">
                    <div>

                    </div>
                    <div className="w-[90%] h-[90%] bg-lime-400">
                        <div className="bg-fuchsia-200 w-[90%] h-[20%]"></div>
                        <div className="bg-fuchsia-200 w-[90%] h-[20%]"></div>
                    </div>
                </div>


            {//futuramente sera utilizado o metodo map() no lugar
            } 
                <div className="grid grid-cols-2 w-full">
                    <div className="w-[98%] h-30 bg-amber-900 m-2 rounded-2xl"></div>
                    <div className="w-[98%] h-30 bg-amber-900 m-2 rounded-2xl"></div>
                    <div className="w-[98%] h-30 bg-amber-900 m-2 rounded-2xl"></div>
                    <div className="w-[98%] h-30 bg-amber-900 m-2 rounded-2xl"></div>
                </div>
            </div>

            <FooterCatalogo />
        </main>
    );
}