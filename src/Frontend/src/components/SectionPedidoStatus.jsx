import HeaderPedido from "./Header/HeaderPedido";
import FooterCatalogo from "./FooterCatalogo";
import { ClipboardList } from 'reicon-react';
import { Calendar } from 'reicon-react';



export default function SectionPedidoStatus() {
    return (
        <div className="">
            <HeaderPedido/>

            <div className="flex flex-col gap-6 mt-6 items-center">
                <div className="flex gap-5 w-[90%]">
                    <div className="flex bg-emerald-100 h-30 w-30 rounded-full justify-center items-center text-emerald-950">
                        <ClipboardList size={70} />
                    </div>
                    <div className="flex flex-col justify-center">
                        <h1 className="text-4xl text-emerald-950">Meus Pedidos</h1>
                        <h3 className="text-xl">Veja o status e detalhes dos seus pedidos.</h3>
                    </div>
                </div>

                <div className="flex flex-col gap-4 w-full items-center">
                    <div className="flex bg-white h-45 w-[90%] shadow rounded-xl hover:scale-101 hover:duration-300 items-center">
                        <div className="flex gap-8">
                            <div className="flex ml-7 bg-emerald-100 h-25 w-25 rounded-full justify-center items-center"></div>
                            <div className="flex flex-col border-l-2 w-70 justify-center">
                                <h1>#QS-2026-XXXX</h1>
                                <p>Nome e Categoria</p>
                                <div>
                                    <Calendar size={24} />
                                    <p>00/00/00</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>

                    <div className="flex bg-white h-45 w-[90%] shadow rounded-xl hover:scale-101 hover:duration-300 items-center">
                        <div className="flex gap-8">
                            <div className="flex ml-7 bg-emerald-100 h-25 w-25 rounded-full justify-center items-center"></div>
                            <div className="flex flex-col border-l-2 w-70 justify-center">
                                <h1>#QS-2026-XXXX</h1>
                                <p>Nome e Categoria</p>
                                <div>
                                    <Calendar size={24} />
                                    <p>00/00/00</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>

                    <div className="flex bg-white h-45 w-[90%] shadow rounded-xl hover:scale-101 hover:duration-300 items-center">
                        <div className="flex gap-8">
                            <div className="flex ml-7 bg-emerald-100 h-25 w-25 rounded-full justify-center items-center"></div>
                            <div className="flex flex-col border-l-2 w-70 justify-center">
                                <h1>#QS-2026-XXXX</h1>
                                <p>Nome e Categoria</p>
                                <div>
                                    <Calendar size={24} />
                                    <p>00/00/00</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>

                </div>
            </div>

            <FooterCatalogo/>
        </div>
    );
}