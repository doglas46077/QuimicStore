import HeaderLogin from "./Header/HeaderLogin";
import FooterCatalogo from "./FooterCatalogo";
import { ClockCircle } from 'reicon-react';
import { CheckCircle } from 'reicon-react';
import { ClipboardList } from 'reicon-react';
import { Home3 } from 'reicon-react';

export default function SectionStatus() {
    return (
        <main className="flex flex-col  gap-7 min-h-screen bg-olive-50">
            <HeaderLogin />
            
            
            <div className="flex flex-col  gap-3 mt-0 justify-center items-center w-full h-200 ">
                <div className="flex flex-col justify-center items-center w-[90%] h-[90%] bg-emerald-100 shadow rounded-2xl">
                    <div className="flex flex-col text-emerald-600 justify-center items-center">
                        <CheckCircle size={100} />
                        <p className="flex justify-center text-2xl h-10 w-60">Pedido Realizado!</p>
                        <p className="text-black">Aguarde a confirmação e retire na FIEC</p>
                    </div>

                    <div className="flex justify-center items-center h-[40%] w-[90%] my-5 bg-olive-50 rounded-2xl">
                        <div className="flex flex-col justify-center items-center">
                            <div className="bg-emerald-200 text-emerald-950 p-3 rounded-full">
                                <ClipboardList size={30} />
                            </div>
                            <p>Número de pedido</p>
                            <p className="text-2xl text-emerald-700">#QS-2026-0042</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center items-center gap-3 w-[90%] h-10">
                    <p>Status:</p>
                    <div className="flex gap-3 text-orange-400">
                        <ClockCircle size={24} />
                        <p>Aguardando confirmação</p>
                    </div>
                </div>

                <div className="flex flex-col gap-5 w-[90%]">
                    
                    <div className="flex justify-center items-center w-full h-15 text-white bg-emerald-950 rounded-lg hover:scale-101 hover:transition-transform hover:bg-emerald-900">
                        <div className="flex items-center gap-3">
                            <Home3 size={30} />
                            <p>Voltar à loja</p>
                        </div>
                    </div>
                    
                    <div className="flex justify-center items-center w-full h-15 bg-emerald-100 rounded-lg hover:scale-101 hover:transition-transform hover:bg-emerald-200">
                        <div className="flex items-center gap-3">
                            <ClipboardList size={30} />
                            <p className="text-emerald-950">Ver meus pedidos</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}