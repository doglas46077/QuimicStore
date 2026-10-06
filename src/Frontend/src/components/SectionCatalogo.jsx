import { Search4 } from 'reicon-react';
import CardCatalogo from './CardCatalogo';
import { Widget } from 'reicon-react';
import { Droplet } from 'reicon-react';
import { Leaf } from 'reicon-react';
import { Wand3 } from 'reicon-react';
import Footer from "./FooterCatalogo"
import HeaderLogin from './Header/HeaderLogin';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function SectionCatalogo() {
    const navigate = useNavigate()

      const [produtos, setProdutos] = useState([])
    return (
        <>
            <HeaderLogin />
            <div className="flex flex-col gap-5 items-center mt-4 mb-6 min-h-screen bg-olive-50">
                <header className="flex flex-col justify-center items-baseline truncate bg-emerald-950  rounded-xl w-[80%] h-30">
                    <div className="flex flex-col ml-8 gap-1 font-sans">
                        <p className="flex justify-baseline text-green-400">FÁBRICA ESCOLA - FIEC</p>
                        <div className="w-200 text-white">
                            <h1 className="flex justify-baseline text-md sm:text-2xl md:text-3xl overflow-hidden text-truncate text-ellipsis">Produtos feitos por alunos de Química</h1>
                            <p className="flex justify-baseline">Limpeza, higiene e cosméticos fabricados na instituição.</p>
                        </div>
                    </div>

                </header>


                <form className="flex bg-white rounded-xl w-[80%] h-10 items-center shadow">
                    <button className="flex w-10 h-10 items-center justify-center hover:text-green-600" type='submit'><Search4 size={24} /></button>
                    <input className="focus:outline-none focus:ring-0" type="text" placeholder="Buscar Produto..." />
                </form>

                <section className="flex gap-3 w-[80%]">
                    <button className="flex justify-center bg-white p-1.5 w-30 rounded-full hover:bg-emerald-950 hover:text-white hover:scale-105 hover:transition hover:duration-300 shadow gap-2">
                        <Widget size={24} />
                        <h3>Todos</h3>
                    </button>

                    <button className="flex justify-center bg-white p-1.5 w-30 rounded-full hover:bg-emerald-950 hover:text-white hover:scale-105 hover:transition hover:duration-300 shadow gap-2">
                        <Wand3 size={24} />
                        <h3>Limpeza</h3>
                    </button>

                    <button className="flex justify-center bg-white p-1.5 w-30 rounded-full hover:bg-emerald-950 hover:text-white hover:scale-105 hover:transition hover:duration-300 shadow gap-2">
                        <Droplet size={24} />
                        <h3>Higiene</h3>
                    </button>

                    <button className="flex justify-center bg-white p-1.5 w-30 rounded-full hover:bg-emerald-950 hover:text-white hover:scale-105 hover:transition hover:duration-300 shadow gap-2">
                        <Leaf size={24} />
                        <h3>Estética</h3>
                    </button>
                </section>

                <section className="grid lg:grid-cols-4 md:grid-cols-2 gap-4 w-[80%] ">
                    {produtos.map((produto) => (
                        <CardCatalogo 
                            key={produto.id}
                            nome={produto.nome}
                            descricao={produto.descricao}
                            preco={produto.preco}
                            imagem={produto.imagem}
                            categoria={produto.categoria}
                        />
                    ))}
                </section>

            </div>
            <Footer />
        </>
    )
}

