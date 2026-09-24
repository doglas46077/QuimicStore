import FooterCatalogo from "./FooterCatalogo";
import { ClipboardList } from 'reicon-react';
import { Calendar } from 'reicon-react';
import { AngleRight } from 'reicon-react';
import HeaderLogin from "./Header/HeaderLogin";





export default function SectionPedidoStatus() {
    return (
        <div className="">
            <HeaderLogin/>

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
                    <div className="flex bg-white h-45 w-[90%] shadow rounded-xl hover:scale-101 hover:duration-300 items-center justify-between">
                        <div className="flex gap-8">
                            <div className="flex items-center h-30 w-40 border-r-2 border-gray-">
                                <div className="flex ml-7 bg-emerald-100 h-25 w-25 rounded-full justify-center items-center"></div>
                            </div>
                            <div className="flex flex-col w-70 justify-center gap-2">
                                <h1 className="text-2xl text-emerald-700">#QS-2026-XXXX</h1>
                                <p>Nome e Categoria</p>
                                <div className="flex gap-2 text-zinc-600">
                                    <Calendar size={24} />
                                    <p>00/00/00</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex w-105 justify-end gap-40 h-35 items-center border-l-2 border-dashed border-zinc-300">
                            <div className="flex flex-col gap-3">
                                <div className="flex justify-center text-white items-center gap-2 bg-zinc-500 rounded-2xl p-1">
                                    <div className="h-4 w-4 bg-white rounded-full"></div>
                                    <h1 className="">Status</h1>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p>Total do pedido</p>
                                    <h1 className="text-2xl text-emerald-700">R$ 00,00</h1>
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
                            <div className="flex items-center h-30 w-40 border-r-2 border-gray-">
                                <div className="flex ml-7 bg-emerald-100 h-25 w-25 rounded-full justify-center items-center"></div>
                            </div>
                            <div className="flex flex-col w-70 justify-center gap-2">
                                <h1 className="text-2xl text-emerald-700">#QS-2026-XXXX</h1>
                                <p>Nome e Categoria</p>
                                <div className="flex gap-2 text-zinc-600">
                                    <Calendar size={24} />
                                    <p>00/00/00</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex w-105 justify-end gap-40 h-35 items-center border-l-2 border-dashed border-zinc-300">
                            <div className="flex flex-col gap-3">
                                <div className="flex justify-center text-white items-center gap-2 bg-zinc-500 rounded-2xl p-1">
                                    <div className="h-4 w-4 bg-white rounded-full"></div>
                                    <h1 className="">Status</h1>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p>Total do pedido</p>
                                    <h1 className="text-2xl text-emerald-700">R$ 00,00</h1>
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
                            <div className="flex items-center h-30 w-40 border-r-2 border-gray-">
                                <div className="flex ml-7 bg-emerald-100 h-25 w-25 rounded-full justify-center items-center"></div>
                            </div>
                            <div className="flex flex-col w-70 justify-center gap-2">
                                <h1 className="text-2xl text-emerald-700">#QS-2026-XXXX</h1>
                                <p>Nome e Categoria</p>
                                <div className="flex gap-2 text-zinc-600">
                                    <Calendar size={24} />
                                    <p>00/00/00</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex w-105 justify-end gap-40 h-35 items-center border-l-2 border-dashed border-zinc-300">
                            <div className="flex flex-col gap-3">
                                <div className="flex justify-center text-white items-center gap-2 bg-zinc-500 rounded-2xl p-1">
                                    <div className="h-4 w-4 bg-white rounded-full"></div>
                                    <h1 className="">Status</h1>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p>Total do pedido</p>
                                    <h1 className="text-2xl text-emerald-700">R$ 00,00</h1>
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