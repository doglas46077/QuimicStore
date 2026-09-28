import HeaderPedidoStatus from "./Header/HeaderPedido";
import FooterCatalogo from "./FooterCatalogo";
import { ClockCircle } from 'reicon-react';
import { Calendar } from 'reicon-react';
import { BagShopping } from 'reicon-react';
import { LocationAlt } from 'reicon-react';
import { Star } from 'reicon-react';
import { TruckFast } from 'reicon-react';




export default function SectionPedidoDetalhes() {
    return (
        <main className="flex flex-col justify-between min-h-screen bg-olive-50">
            <HeaderPedidoStatus />
            <div className="flex justify-center w-full">
                <div className="flex w-[90%] justify-between">
                    <div className="flex gap-7 justify-baseline items-center w-[30%]">
                        <div className="bg-yellow-200 text-yellow-500 rounded-full p-3">
                            <ClockCircle size={44} />
                        </div>
                        <div>
                            <p className="text-2xl text-emerald-700">Pedido #QS-2026-0042</p>
                            <p className="text-sm">Realizado em 08/04/26 ás 14:32</p>
                        </div>                    
                    </div>

                    <div className="flex flex-col justify-center items-end w-[25%]">
                        <div className="flex justify-center w-full">
                            <div className="flex justify-center text-white items-center w-[35%] gap-2 bg-zinc-500 rounded-2xl p-1">
                                <div className="h-4 w-4 bg-white rounded-full"></div>
                                <h1 className="">Status</h1>
                            </div>
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
            </div>

            <div className="flex flex-col justify-center items-center">
                <div className="flex flex-col justify-center items-center gap-3 p-1 bg-white shadow h-50 w-[90%] rounded-lg">
                    <div className="flex w-[99%] gap-1 items-center">
                        <div className="bg-emerald-200 p-1 rounded-full text-emerald-700">
                            <BagShopping size={24} />
                        </div>
                        <p>Produtos do pedido</p>
                    </div>
                    <div className="flex flex-col w-[99%] h-[70%] bg-zinc-300 gap-0.5 items-center justify-end p-0.5 rounded-lg">
                        <p></p>
                        <div className="flex justify-between p-2 iwhite shadower bg-white w-full h-[38%] rounded-lg">
                           <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-zinc-400 rounded-lg"></div>
                                <div>
                                    <p className=" font-light">Nome do produto</p>
                                    <p className="font-light">ml / Litros</p>
                                </div>
                           </div>

                           <div className="flex gap-25 font-light w-[20%]">
                            <p>0</p>
                            <p>R$ 00,00</p>
                           </div>
                        </div>

                        <div className="flex justify-between p-2 items-center bg-white w-full h-[38%] rounded-lg">
                            <div className="flex items-center gap-2">
                                   <div className="w-10 h-10 bg-zinc-400 rounded-lg"></div>
                                <div>
                                    <p className=" font-light">Nome do produto</p>
                                    <p className="font-light">ml / Litros</p>
                                </div>
                            </div>

                            <div className="flex gap-25 font-light w-[20%]">
                                <p>0</p>
                                <p>R$ 00,00</p>
                            </div>
                        </div>

                    </div>
                </div>


            {//futuramente sera utilizado o metodo map() no lugar
            } 



            {
                //================================== RESUMO DE PEDIDO ======================
            }
                <div className="grid grid-cols-2 w-[91%]">
                    <div className="w-[98%] h-40 bg-white shadow m-2 rounded-lg">1</div>



{
    //============================================ INFORMAÇÕES DE RETIRADA ==================
}
                    <div className="flex justify-center w-[98%] h-40 p-3 bg-white shadow m-2 rounded-lg">
                        <div className="flex w-[96%] gap-3">
                            <div className="flex justify-center items-center bg-emerald-200 h-8 w-8 rounded-full">
                                <LocationAlt size={20} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <p>Informações de retirada</p>
                                <div className="text-sm font-light">
                                    <p className="font-bold">FIEC - Laboratório de Química</p>
                                    <p>Av. Eng. Fábio Roberto Barnabé, 3405</p>
                                    <p>Jardim Regina, Indaiatuba - SP</p>
                                    <p>CEP:13349-003</p>
                                </div>
                            </div>

                        </div>
                    </div>

                    {
                        //============================== STATUS DE PEDIDO ===========================
                    }

                    <div className="flex flex-col items-center  gap-2 w-[98%] h-40 p-3 bg-white shadow m-2 rounded-lg">
                        <div className="w-[96%]">
                            <div className="flex items-center gap-3">
                                <div className="flex justify-center items-center rounded-full bg-emerald-200 h-8 w-8">
                                    <TruckFast size={20} />
                                </div>
                                <p>Status de pedido</p>
                            </div>
                        </div>

                        <div className="flex gap-7 justify- w-[94%]">
                            <div>
                                {[1, 2, 3, 4].map((item, index) => (
                                    <div key={item} className="flex flex-col items-center">
                                        <div className={`w-4 h-4 rounded-full border-2 ${
                                            index === 0 ? "bg-orange-400 border-orange-400" : "bg-white border-gray-300"
                                        }`} />
                                        {index < 3 && <div className="w-0.5 h-2 bg-gray-300" />}
                                    </div>
                                ))}
                            </div>

                            <div className="w-full">
                                <div className="flex justify-between w-full">
                                    <p>Pedido realizado</p>
                                    <p className="font-light">data e horario</p>
                                </div>
                                
                                <div className="flex justify-between w-full">
                                    <p>Em preparação</p>
                                    <p className="font-light">data e horario</p>
                                </div>

                                <div className="flex justify-between w-full">
                                    <p>Pronto para retirada</p>
                                    <p className="font-light">data e horario</p>
                                </div>
                                
                                <div className="flex justify-between w-full">
                                    <p>Retirado</p>
                                    <p className="font-light">data e horario</p>
                                </div>
                            </div>
                        </div>
                    </div>

{//================================ AVALIAÇÃO POR ESTRELAS =========================
}

                    <div className="flex justify-center w-[98%] h-40 p-3 bg-white shadow m-2 rounded-lg">
                        <div className="flex flex-col justify-center items-center w-full">
                            <div className="flex items-center gap-3 w-[96%]">
                                <div className="flex justify-center items-center rounded-full bg-emerald-200 h-8 w-8">
                                    <Star size={20} />
                                </div>
                                    <p>Avalie seu pedido</p>
                            </div>
                            <div className="flex flex-col w-full justify-center">
                                <div className="flex gap-7 justify-center">
                                    <Star size={25} />
                                    <Star size={25} />
                                    <Star size={25} />
                                    <Star size={25} />
                                    <Star size={25} />
                                </div>
                                <p className="flex justify-center text- font-light">Conte-nos sobre sua experiência com a QuimicStore.</p>
                                <button className="bg-emerald-200 p-1 rounded-lg hover:scale-101 hover:transition-transform">
                                    Avaliar pedido
                                </button>
                            </div>

                        </div>
                    </div>

                </div>
            </div>

            <FooterCatalogo />
        </main>
    );
}