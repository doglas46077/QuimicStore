import { Search4 } from 'reicon-react';
import CardCatalogo from './CardCatalogo';
import Paginacao from './Paginacao';
import { Widget } from 'reicon-react';
import { Droplet } from 'reicon-react';
import { Leaf } from 'reicon-react';
import { Wand3 } from 'reicon-react';
import Footer from "./FooterCatalogo"
import HeaderLogin from './Header/HeaderLogin';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useCarrinho } from './JavaScript/carrinhoAnimacao';
import { API_URL } from './api';

const POR_PAGINA = 12 


function normalizar(texto) {
    return (texto || "")
        .toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
}

export default function SectionCatalogo() {
    const navigate = useNavigate()
    const { adicionar, podeAdicionar } = useCarrinho()

   
    const [params, setParams] = useSearchParams()
    const pagina = Math.max(1, Number(params.get("page")) || 1)

    const [produtos, setProdutos] = useState([])
    const [ultimaPagina, setUltimaPagina] = useState(1)
    const [total, setTotal] = useState(0)
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState("")
    const [categorias, setCategorias] = useState({})
    const [busca, setBusca] = useState("")
    const [filtroCategoria, setFiltroCategoria] = useState("")

    useEffect(() => {
        async function carregarCategorias() {
            try {
                const resposta = await fetch(`${API_URL}/categorias`, {
                    headers: { "Accept": "application/json" },
                })
                if (!resposta.ok) return

                const dados = await resposta.json()
                const lista = Array.isArray(dados)
                    ? dados
                    : dados.data || dados.categorias || []
                const mapa = {}
                lista.forEach((c) => { mapa[c.id] = c.nome })
                setCategorias(mapa)
            } catch (e) {
            }
        }

        carregarCategorias()
    }, [])

    useEffect(() => {
        let cancelado = false 
        async function carregarProdutos() {
            setCarregando(true)
            setErro("")

            try {
                const token = localStorage.getItem("token")
                const response = await fetch(
                    `${API_URL}/mostrar-produtos?page=${pagina}&per_page=${POR_PAGINA}`,
                    {
                        headers: {
                            "Accept": "application/json",
                            "Authorization": `Bearer ${token}`,
                        },
                    }
                )
                if (cancelado) return

                if (response.status === 401) {
                    localStorage.removeItem("token")
                    localStorage.removeItem("usuario")
                    navigate("/login")
                    return
                }

                const dados = await response.json()
                if (cancelado) return

                if (!response.ok) {
                    setErro(dados.message || dados.mensagem || "Erro ao carregar os produtos")
                    return
                }

                const lista = Array.isArray(dados) ? dados : dados.data || dados.produtos || []
                const ultima = dados.meta?.last_page || 1

                if (pagina > ultima) {
                    setParams({ page: ultima }, { replace: true })
                    return
                }

                setProdutos(lista)
                setUltimaPagina(ultima)
                setTotal(dados.meta?.total ?? lista.length)
            } catch (e) {
                if (!cancelado) setErro("Não foi possível conectar ao servidor")
            } finally {
                if (!cancelado) setCarregando(false)
            }
        }

        carregarProdutos()
        return () => { cancelado = true }
    }, [pagina])

    function irParaPagina(numero) {
        setParams(numero === 1 ? {} : { page: numero })
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    function selecionarCategoria(categoria) {
        setFiltroCategoria(categoria)
        if (pagina !== 1) setParams({})
    }

    const termo = normalizar(busca.trim())

    const produtosVisiveis = produtos
        .filter((produto) => produto.ativo !== false && produto.ativo !== 0)
        .filter((produto) =>
            !termo ||
            normalizar(produto.nome).includes(termo) ||
            normalizar(produto.descricao).includes(termo) ||
            normalizar(categorias[produto.categoria_id]).includes(termo)
        )
        .filter((produto) =>
            !filtroCategoria || normalizar(categorias[produto.categoria_id]).includes(normalizar(filtroCategoria))
        )

    const classeFiltro = (categoria) => `flex justify-center p-1.5 w-30 rounded-full hover:bg-emerald-950 hover:text-white hover:scale-105 hover:transition hover:duration-300 shadow gap-2 ${filtroCategoria === categoria ? "bg-emerald-950 text-white" : "bg-white"}`

    return (
        <>
            <HeaderLogin />
            <div className="flex flex-col gap-5 items-center mt-4 mb-6 min-h-screen bg-olive-50 pb-24">
                <header className="flex flex-col justify-center items-baseline truncate bg-emerald-950  rounded-xl w-[80%] h-30">
                    <div className="flex flex-col ml-8 gap-1 font-sans">
                        <p className="flex justify-baseline text-green-400">FÁBRICA ESCOLA - FIEC</p>
                        <div className="w-200 text-white">
                            <h1 className="flex justify-baseline text-md sm:text-2xl md:text-3xl overflow-hidden text-truncate text-ellipsis">Produtos feitos por alunos de Química</h1>
                            <p className="flex justify-baseline">Limpeza, higiene e cosméticos fabricados na instituição.</p>
                        </div>
                    </div>

                </header>


                <form
                    onSubmit={(e) => e.preventDefault()}
                    className="flex bg-white rounded-xl w-[80%] h-10 items-center shadow"
                >
                    <button className="flex w-10 h-10 items-center justify-center hover:text-green-600" type='submit'><Search4 size={24} /></button>
                    <input
                        className="flex-1 pr-3 focus:outline-none focus:ring-0"
                        type="text"
                        placeholder="Buscar Produto..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                    />
                </form>

                <section className="flex gap-3 w-[80%]">
                    <button type="button" aria-pressed={!filtroCategoria} onClick={() => selecionarCategoria("")} className={classeFiltro("")}>
                        <Widget size={24} />
                        <h3>Todos</h3>
                    </button>

                    <button type="button" aria-pressed={filtroCategoria === "Limpeza"} onClick={() => selecionarCategoria("Limpeza")} className={classeFiltro("Limpeza")}>
                        <Wand3 size={24} />
                        <h3>Limpeza</h3>
                    </button>

                    <button type="button" aria-pressed={filtroCategoria === "Higiene"} onClick={() => selecionarCategoria("Higiene")} className={classeFiltro("Higiene")}>
                        <Droplet size={24} />
                        <h3>Higiene</h3>
                    </button>

                    <button type="button" aria-pressed={filtroCategoria === "Estética"} onClick={() => selecionarCategoria("Estética")} className={classeFiltro("Estética")}>
                        <Leaf size={24} />
                        <h3>Estética</h3>
                    </button>
                </section>

                <section className={`grid lg:grid-cols-4 md:grid-cols-2 gap-4 w-[80%] transition-opacity ${carregando ? "opacity-60" : ""}`}>
                    {produtosVisiveis.map((produto) => (
                        <CardCatalogo
                            key={produto.id}
                            onAbrir={() => navigate(`/produto/${produto.id}`, { state: { produto: { ...produto, categoria: categorias[produto.categoria_id] } } })}
                            nome={produto.nome}
                            descricao={produto.descricao}
                            preco={produto.preco}
                            imagem={produto.imagem}
                            alt={produto.nome}
                            categoria={categorias[produto.categoria_id]}
                            estoque={produto.estoque}
                            podeAdicionar={() => podeAdicionar(produto)}
                            onAdicionar={() => adicionar(produto)}
                        />
                    ))}
                </section>

                {carregando && <p className="text-slate-500">Carregando produtos...</p>}
                {erro && <p className="text-red-600">{erro}</p>}
                {!carregando && !erro && total === 0 && (
                    <p className="text-slate-500">Nenhum produto cadastrado.</p>
                )}
                {!carregando && !erro && produtos.length > 0 && produtosVisiveis.length === 0 && (
                    <p className="text-slate-500">Nenhum produto encontrado nesta página para "{busca}".</p>
                )}

                {ultimaPagina > 1 && !erro && (
                    <Paginacao
                        paginaAtual={pagina}
                        ultimaPagina={ultimaPagina}
                        total={total}
                        onMudar={irParaPagina}
                        desabilitado={carregando}
                    />
                )}

            </div>
            <Footer />
        </>
    )
}
