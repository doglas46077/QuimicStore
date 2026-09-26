import HeaderLogin from "./Header/HeaderLogin";
import FooterCatalogo from "./FooterCatalogo";
import { ClockCircle } from 'reicon-react';
import { CheckCircle } from 'reicon-react';
import { ClipboardList } from 'reicon-react';
import { Home3 } from 'reicon-react';

export default function SectionStatus() {
    return (
        <main className="flex flex-col gap-7 min-h-screen bg-olive-50">
            <HeaderLogin />
            
            
            <div className="flex flex-col gap-3 mt-0 justify-center items-center w-full h-135 ">
                <div className="flex flex-col justify-center items-center w-[90%] h-[90%] bg-emerald-100 shadow rounded-2xl">
                    <div className="flex flex-col justify-center items-center">
                        <CheckCircle size={100} />
                        <p className="flex justify-center text-2xl h-10 w-60">Pedido Realizado!</p>
                        <p>Aguarde a confirmação e retire na FIEC</p>
                    </div>

                    <div className="h-[40%] w-[90%] my-5 bg-olive-50 rounded-2xl">

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
                    
                    <div className="flex justify-center items-center w-full h-10 text-white bg-emerald-950 rounded-lg hover:scale-101 hover:transition-transform">
                        <div className="flex items-center gap-3">
                            <Home3 size={30} />
                            <p>Voltar à loja</p>
                        </div>
                    </div>
                    
                    <div className="flex justify-center items-center w-full h-10 bg-emerald-100 rounded-lg hover:scale-101 hover:transition-transform">
                        <div className="flex items-center gap-3">
                            <ClipboardList size={30} />
                            <p>Ver meus pedidos</p>
                        </div>
                    </div>
                </div>
            </div>


            <FooterCatalogo />
        </main>
    );
}