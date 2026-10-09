import { Search4 } from 'reicon-react';
import CardCatalogo from './CardCatalogo';
import { Widget } from 'reicon-react';
import { Droplet } from 'reicon-react';
import { Leaf } from 'reicon-react';
import { Wand3 } from 'reicon-react';
import Footer from "./FooterCatalogo"
import HeaderLogin from './Header/HeaderLogin';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const API_URL = "http://localhost:8000/api"

// Ignora maiúsculas e acentos: "estetica" encontra "Estética"
function normalizar(texto) {
    return (texto || "")
        .toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
}

export default function SectionCatalogo() {
    const navigate = useNavigate()

    const [produtos, setProdutos] = useState([])
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState("")
    const [categorias, setCategorias] = useState({})
    const [busca, setBusca] = useState("")

    useEffect(() => {
        async function carregarProdutos() {
            try {
                const token = localStorage.getItem("token")
                const [response, respostaCategorias] = await Promise.all([
                    fetch(`${API_URL}/showProducts`, {
                        headers: {
                            "Accept": "application/json",
                            "Authorization": `Bearer ${token}`,
                        },
                    }),
                    fetch(`${API_URL}/categorias`, {
                        headers: { "Accept": "application/json" },
                    }),
                ])
                
                if (respostaCategorias.ok) {
                    const dadosCategorias = await respostaCategorias.json()
                    const lista = Array.isArray(dadosCategorias)
                        ? dadosCategorias
                        : dadosCategorias.data || dadosCategorias.categorias || []
                    const mapa = {}
                    lista.forEach((c) => { mapa[c.id] = c.nome })
                    setCategorias(mapa)
                }

                if (response.status === 401) {
                    localStorage.removeItem("token")
                    localStorage.removeItem("usuario")
                    navigate("/login")
                    return
                }

                const dados = await response.json()

                if (!response.ok) {
                    setErro(dados.message || dados.mensagem || "Erro ao carregar os produtos")
                    return
                }
                setProdutos(Array.isArray(dados) ? dados : dados.produtos || dados.data || [])
            } catch (e) {
                setErro("Não foi possível conectar ao servidor")
            } finally {
                setCarregando(false)
            }
        }

        carregarProdutos()
    }, [])

    // Produtos ativos que combinam com o texto da busca (nome, descrição ou categoria)
    const termo = normalizar(busca.trim())

    const produtosVisiveis = produtos
        .filter((produto) => produto.ativo !== false && produto.ativo !== 0)
        .filter((produto) =>
            !termo ||
            normalizar(produto.nome).includes(termo) ||
            normalizar(produto.descricao).includes(termo) ||
            normalizar(categorias[produto.categoria_id]).includes(termo)
        )

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
                    {produtosVisiveis.map((produto) => (
                        <CardCatalogo
                            key={produto.id}
                            nome={produto.nome}
                            descricao={produto.descricao}
                            preco={produto.preco}
                            imagem={produto.imagem}
                            alt={produto.nome}
                            categoria={categorias[produto.categoria_id]}
                        />
                    ))}
                </section>

                {carregando && <p className="text-slate-500">Carregando produtos...</p>}
                {erro && <p className="text-red-600">{erro}</p>}
                {!carregando && !erro && produtos.length === 0 && (
                    <p className="text-slate-500">Nenhum produto cadastrado.</p>
                )}
                {!carregando && !erro && produtos.length > 0 && produtosVisiveis.length === 0 && (
                    <p className="text-slate-500">Nenhum produto encontrado para "{busca}".</p>
                )}

            </div>
            <Footer />
        </>
    )
}