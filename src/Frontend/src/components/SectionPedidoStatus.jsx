import HeaderPedido from "./Header/HeaderPedido";
import FooterCatalogo from "./FooterCatalogo";
import { ClipboardList } from 'reicon-react';
import { Calendar } from 'reicon-react';
import { AngleRight } from 'reicon-react';





export default function SectionPedidoStatus() {
    return (
        <div className="">
            <HeaderPedido/>

            <div className="flex flex-col gap-6 mt-6 items-center">
                <div className="flex gap-5 w-[90%]">
                    <div className="flex bg-emerald-100 h-30 w-30 rounded-full justify-center items-center text-emerald-950">
                        <ClipboardList size={70} />
                    </div>
                    <div className="flex flex-col justify-center gap-0.5">
                        <h1 className="text-4xl text-emerald-950">Meus Pedidos</h1>
                        <h3 className="text-x2 text-gray-500">Veja o status e detalhes dos seus pedidos.</h3>
                    </div>
                </div>

                <div className="flex flex-col gap-4 w-full items-center">
                    <div className="flex bg-white h-45 w-[90%] shadow rounded-xl hover:scale-101 hover:duration-300 items-center justify-between">
                        <div className="flex gap-8">
                            <div className="flex items-center h-30 w-40 border-r-2 border-gray-400">
                                <div className="flex ml-7 bg-emerald-100 h-25 w-25 rounded-full justify-center items-center"></div>
                            </div>
                            <div className="flex flex-col w-70 justify-center gap-2">
                                <h1 className="text-2xl text-emerald-800">#QS-2026-XXXX</h1>
                                <p className="text-lg">Nome e Categoria</p>
                                <div className="flex gap-2 text-gray-500">
                                    <Calendar size={24} />
                                    <p className="text-lg">00/00/00</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex h-30 gap-40 items-center border-l-2 border-dashed border-gray-400">
                            <div className="flex flex-col gap-6 ml-7">
                                <div className="flex justify-center bg-gray-400 rounded-2xl">
                                    <h1 className="text-2xl">Status</h1>
                                </div>
                                <div>
                                    <p>Total do pedido</p>
                                    <h1 className="text-2xl text-emerald-800">R$ 00,00</h1>
                                </div>
                            </div>
                            <div className="mr-10">
                                <div className="flex items-center justify-center h-15 w-15 bg-emerald-100 rounded-2xl hover:bg-emerald-200">
                                    <AngleRight size={34} />
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="flex bg-white h-45 w-[90%] shadow rounded-xl hover:scale-101 hover:duration-300 items-center justify-between">
                        <div className="flex gap-8">
                            <div className="flex items-center h-30 w-40 border-r-2 border-gray-400">
                                <div className="flex ml-7 bg-emerald-100 h-25 w-25 rounded-full justify-center items-center"></div>
                            </div>
                            <div className="flex flex-col w-70 justify-center gap-2">
                                <h1 className="text-2xl text-emerald-800">#QS-2026-XXXX</h1>
                                <p className="text-lg">Nome e Categoria</p>
                                <div className="flex gap-2 text-gray-500">
                                    <Calendar size={24} />
                                    <p className="text-lg">00/00/00</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex h-30 gap-40 items-center border-l-2 border-dashed border-gray-400">
                            <div className="flex flex-col gap-6 ml-7">
                                <div className="flex justify-center bg-gray-400 rounded-2xl">
                                    <h1 className="text-2xl">Status</h1>
                                </div>
                                <div>
                                    <p>Total do pedido</p>
                                    <h1 className="text-2xl text-emerald-800">R$ 00,00</h1>
                                </div>
                            </div>
                            <div className="mr-10">
                                <div className="flex items-center justify-center h-15 w-15 bg-emerald-100 rounded-2xl hover:bg-emerald-200">
                                    <AngleRight size={34} />
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="flex bg-white h-45 w-[90%] shadow rounded-xl hover:scale-101 hover:duration-300 items-center justify-between">
                        <div className="flex gap-8">
                            <div className="flex items-center h-30 w-40 border-r-2 border-gray-400">
                                <div className="flex ml-7 bg-emerald-100 h-25 w-25 rounded-full justify-center items-center"></div>
                            </div>
                            <div className="flex flex-col w-70 justify-center gap-2">
                                <h1 className="text-2xl text-emerald-800">#QS-2026-XXXX</h1>
                                <p className="text-lg">Nome e Categoria</p>
                                <div className="flex gap-2 text-gray-500">
                                    <Calendar size={24} />
                                    <p className="text-lg">00/00/00</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex h-30 gap-40 items-center border-l-2 border-dashed border-gray-400">
                            <div className="flex flex-col gap-6 ml-7">
                                <div className="flex justify-center bg-gray-400 rounded-2xl">
                                    <h1 className="text-2xl">Status</h1>
                                </div>
                                <div>
                                    <p>Total do pedido</p>
                                    <h1 className="text-2xl text-emerald-800">R$ 00,00</h1>
                                </div>
                            </div>
                            <div className="mr-10">
                                <div className="flex items-center justify-center h-15 w-15 bg-emerald-100 rounded-2xl hover:bg-emerald-200">
                                    <AngleRight size={34} />
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <FooterCatalogo/>
        </div>
    );
}