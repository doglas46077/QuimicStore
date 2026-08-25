import { Search4 } from 'reicon-react';
import { CartLarge5 } from 'reicon-react';
import { Widget } from 'reicon-react';
import { Droplet } from 'reicon-react';
import { Leaf } from 'reicon-react';
import { Wand3 } from 'reicon-react';
import Footer from "./FooterCatalogo"
import HeaderCatalogo from './Header/HeaderCatalogo';

export default function SectionCatalogo() {
    return (
        <>
        <HeaderCatalogo />
        <div className="flex flex-col gap-5 items-center mt-4  min-h-screen bg-olive-100">
            <header className="flex flex-col justify-center items-baseline bg-green-900  rounded-xl w-[80%] h-30">
                <div className="flex flex-col ml-8 gap-1 font-sans">
                    <p className="flex justify-baseline text-green-400">FÁBRICA ESCOLA - FIEC</p>
                    <div className="w-200 text-white">
                        <h1 className="flex justify-baseline">Produtos feitos por alunos de Química</h1>
                        <p className="flex justify-baseline">Limpeza, higiene e cosméticos fabricados na instituição.</p>
                    </div>
                </div>
            </header>
            
            <section className="flex bg-white rounded-xl w-[80%] h-10 items-center shadow">
                <button className="flex w-10 h-10 items-center justify-center"><Search4 size={24} /></button>
                <input className="focus:outline-none focus:ring-0" type="text" placeholder="Buscar Produto..."/>
            </section>

            <section className="flex gap-3 w-[80%]">
                <div className="flex justify-center bg-white p-1.5 w-30 rounded-full hover:bg-green-900 hover:text-white hover:scale-105 hover:transition hover:duration-300 shadow gap-2">
                    <Widget size={24} />
                    <h3>Todos</h3>
                </div>

                <div className="flex justify-center bg-white p-1.5 w-30 rounded-full hover:bg-green-900 hover:text-white hover:scale-105 hover:transition hover:duration-300 shadow gap-2">
                    <Wand3 size={24} />
                    <h3>Limpeza</h3>
                </div>

                <div className="flex justify-center bg-white p-1.5 w-30 rounded-full hover:bg-green-900 hover:text-white hover:scale-105 hover:transition hover:duration-300 shadow gap-2">
                    <Droplet size={24} />
                    <h3>Higiene</h3>
                </div>

                <div className="flex justify-center bg-white p-1.5 w-30 rounded-full hover:bg-green-900 hover:text-white hover:scale-105 hover:transition hover:duration-300 shadow gap-2">
                    <Leaf size={24} />
                    <h3>Estética</h3>
                </div>
            </section>

            <section className="grid grid-cols-4 gap-4 w-[80%] ">
                
                <div className="flex flex-col w-[95%] h-110 bg-white rounded-xl shadow items-center gap-3 hover:scale-105 hover:transition hover:duration-300">
                    <div className="bg-gray-500 w-[90%] h-[45%] mt-3 rounded-xl"></div>
                    <div className="flex flex-col items-baseline w-[90%]">
                        <p className="text-green-600">Categoria</p>
                        <div className="" >
                            <h1>Nome Produto</h1>
                            <p className="flex justify-baseline">Descrição</p>
                        </div>
                    </div>
                    <div className="flex w-[90%] justify-between items-center mt-[25%]">
                        <h1>R$ 00,00</h1>
                        <div className='flex justify-center p-1 rounded-full w-30 border-3 border-green-600 hover:bg-green-600 hover:text-white'>
                            <CartLarge5 size={24} />
                            <p>Adicionar</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col w-[95%] h-110 bg-white rounded-xl shadow items-center gap-3 hover:scale-105 hover:transition hover:duration-300">
                    <div className="bg-gray-500 w-[90%] h-[45%] mt-3 rounded-xl"></div>
                    <div className="flex flex-col items-baseline w-[90%]">
                        <p className="text-green-600">Categoria</p>
                        <div >
                            <h1>Nome Produto</h1>
                            <p className="flex justify-baseline">Descrição</p>
                        </div>
                    </div>
                    <div className="flex w-[90%] justify-between items-center mt-[25%]">
                        <h1>R$ 00,00</h1>
                        <div className='flex justify-center p-1 rounded-full w-30 border-3 border-green-600 hover:bg-green-600 hover:text-white'>
                            <CartLarge5 size={24} />
                            <p>Adicionar</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col w-[95%] h-110 bg-white rounded-xl shadow items-center gap-3 hover:scale-105 hover:transition hover:duration-300">
                    <div className="bg-gray-500 w-[90%] h-[45%] mt-3 rounded-xl"></div>
                    <div className="flex flex-col items-baseline w-[90%]">
                        <p className="text-green-600">Categoria</p>
                        <div >
                            <h1>Nome Produto</h1>
                            <p className="flex justify-baseline">Descrição</p>
                        </div>
                    </div>
                    <div className="flex w-[90%] justify-between items-center mt-[25%]">
                        <h1>R$ 00,00</h1>
                        <div className='flex justify-center p-1 rounded-full w-30 border-3 border-green-600 hover:bg-green-600 hover:text-white'>
                            <CartLarge5 size={24} />
                            <p>Adicionar</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col w-[95%] h-110 bg-white rounded-xl shadow items-center gap-3 hover:scale-105 hover:transition hover:duration-300">
                    <div className="bg-gray-500 w-[90%] h-[45%] mt-3 rounded-xl"></div>
                    <div className="flex flex-col items-baseline w-[90%]">
                        <p className="text-green-600">Categoria</p>
                        <div >
                            <h1>Nome Produto</h1>
                            <p className="flex justify-baseline">Descrição</p>
                        </div>
                    </div>
                    <div className="flex w-[90%] justify-between items-center mt-[25%]">
                        <h1>R$ 00,00</h1>
                        <div className='flex justify-center p-1 rounded-full w-30 border-3 border-green-600 hover:bg-green-600 hover:text-white'>
                            <CartLarge5 size={24} />
                            <p>Adicionar</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col w-[95%] h-110 bg-white rounded-xl shadow items-center gap-3 hover:scale-105 hover:transition hover:duration-300">
                    <div className="bg-gray-500 w-[90%] h-[45%] mt-3 rounded-xl"></div>
                    <div className="flex flex-col items-baseline w-[90%]">
                        <p className="text-green-600">Categoria</p>
                        <div >
                            <h1>Nome Produto</h1>
                            <p className="flex justify-baseline">Descrição</p>
                        </div>
                    </div>
                    <div className="flex w-[90%] justify-between items-center mt-[25%]">
                        <h1>R$ 00,00</h1>
                        <div className='flex justify-center p-1 rounded-full w-30 border-3 border-green-600 hover:bg-green-600 hover:text-white'>
                            <CartLarge5 size={24} />
                            <p>Adicionar</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col w-[95%] h-110 bg-white rounded-xl shadow items-center gap-3 hover:scale-105 hover:transition hover:duration-300">
                    <div className="bg-gray-500 w-[90%] h-[45%] mt-3 rounded-xl"></div>
                    <div className="flex flex-col items-baseline w-[90%]">
                        <p className="text-green-600">Categoria</p>
                        <div >
                            <h1>Nome Produto</h1>
                            <p className="flex justify-baseline">Descrição</p>
                        </div>
                    </div>
                    <div className="flex w-[90%] justify-between items-center mt-[25%]">
                        <h1>R$ 00,00</h1>
                        <div className='flex justify-center p-1 rounded-full w-30 border-3 border-green-600 hover:bg-green-600 hover:text-white'>
                            <CartLarge5 size={24} />
                            <p>Adicionar</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col w-[95%] h-110 bg-white rounded-xl shadow items-center gap-3 hover:scale-105 hover:transition hover:duration-300">
                    <div className="bg-gray-500 w-[90%] h-[45%] mt-3 rounded-xl"></div>
                    <div className="flex flex-col items-baseline w-[90%]">
                        <p className="text-green-600">Categoria</p>
                        <div >
                            <h1>Nome Produto</h1>
                            <p className="flex justify-baseline">Descrição</p>
                        </div>
                    </div>
                    <div className="flex w-[90%] justify-between items-center mt-[25%]">
                        <h1>R$ 00,00</h1>
                        <div className='flex justify-center p-1 rounded-full w-30 border-3 border-green-600 hover:bg-green-600 hover:text-white'>
                            <CartLarge5 size={24} />
                            <p>Adicionar</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col w-[95%] h-110 bg-white rounded-xl shadow items-center gap-3 hover:scale-105 hover:transition hover:duration-300">
                    <div className="bg-gray-500 w-[90%] h-[45%] mt-3 rounded-xl"></div>
                    <div className="flex flex-col items-baseline w-[90%]">
                        <p className="text-green-600">Categoria</p>
                        <div >
                            <h1>Nome Produto</h1>
                            <p className="flex justify-baseline">Descrição</p>
                        </div>
                    </div>
                    <div className="flex w-[90%] justify-between items-center mt-[25%]">
                        <h1>R$ 00,00</h1>
                        <div className='flex justify-center p-1 rounded-full w-30 border-3 border-green-600 hover:bg-green-600 hover:text-white'>
                            <CartLarge5 size={24} />
                            <p>Adicionar</p>
                        </div>
                    </div>
                </div>

            </section>
        
        </div>
        <Footer/>
        </>
    )
}