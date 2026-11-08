import HeaderLogin from "./Header/HeaderLogin";
import { User, Package } from "reicon-react";
import FooterCatalogo from "./FooterCatalogo"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "./api";

function SectionPerfil() {
const navigate = useNavigate()

const [nome, setNome] = useState("")
const [email, setEmail] = useState("")
const [enviandoRecuperacao, setEnviandoRecuperacao] = useState(false)
const [mensagemRecuperacao, setMensagemRecuperacao] = useState("")
const [erroRecuperacao, setErroRecuperacao] = useState("")
const [modoEscuro, setModoEscuro] = useState(() => localStorage.getItem("modoEscuro") === "true")
const [pedidos, setPedidos] = useState([])
const [carregandoPedidos, setCarregandoPedidos] = useState(true)
const [erroPedidos, setErroPedidos] = useState("")

    useEffect(() => {
      document.documentElement.classList.toggle("dark", modoEscuro)
      localStorage.setItem("modoEscuro", String(modoEscuro))
    }, [modoEscuro])

    useEffect (() => {
      const usuarioSalvo = JSON.parse(localStorage.getItem("usuario")|| "null")
      const token = localStorage.getItem("token")

      if (!usuarioSalvo || !token) {
        navigate("/login")
        return
      }

      setNome(usuarioSalvo.nome)
      setEmail(usuarioSalvo.email)
    }, [])

    useEffect(() => {
      let ativo = true
      async function carregarPedidos() {
        const usuario = JSON.parse(localStorage.getItem("usuario") || "null")
        const token = localStorage.getItem("token")
        if (!usuario?.id || !token) { setCarregandoPedidos(false); return }
        try {
          const response = await fetch(`${API_URL}/mostrar-pedido/${usuario.id}/usuario`, {
            headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
          })
          const dados = await response.json().catch(() => ({}))
          if (!ativo) return
          if (response.status === 401) {
            localStorage.removeItem("token")
            localStorage.removeItem("usuario")
            navigate("/login")
            return
          }
          if (response.status === 404 && dados.message?.startsWith("Nenhum pedido")) { setPedidos([]); return }
          if (!response.ok) throw new Error(dados.message || "Não foi possível carregar suas compras.")
          const lista = Array.isArray(dados.dados) ? dados.dados : []
          setPedidos(lista.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)).slice(0, 3))
          setErroPedidos("")
        } catch (erro) {
          if (ativo) setErroPedidos(erro.message || "Não foi possível conectar ao servidor.")
        } finally {
          if (ativo) setCarregandoPedidos(false)
        }
      }
      carregarPedidos()
      return () => { ativo = false }
    }, [navigate])

    function formatarData(data) {
      if (!data) return "Data indisponível"
      const valor = new Date(data)
      return Number.isNaN(valor.getTime()) ? "Data indisponível" : valor.toLocaleDateString("pt-BR")
    }

    function formatarPreco(valor) {
      const numero = Number(valor)
      return Number.isFinite(numero) ? numero.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "Valor indisponível"
    }

    function nomeStatus(pedido) {
      const status = String(pedido.status ?? pedido.status_pedido ?? pedido.pagamento?.status ?? "aguardando").toLowerCase()
      if (status.includes("cancel")) return { texto: "Cancelado", classe: "bg-red-50 text-red-700" }
      if (status.includes("aprov") || status.includes("entreg")) return { texto: status.includes("entreg") ? "Entregue" : "Aprovado", classe: "bg-emerald-50 text-emerald-700" }
      return { texto: "Aguardando", classe: "bg-amber-50 text-amber-700" }
    }

    const inicial = nome ? nome.charAt(0).toUpperCase() : "?"

    async function solicitarRedefinicaoSenha() {
      if (!email || enviandoRecuperacao) return
      setEnviandoRecuperacao(true)
      setErroRecuperacao("")
      setMensagemRecuperacao("")
      try {
        const response = await fetch(`${API_URL}/esqueceu-senha`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ email }),
        })
        const dados = await response.json().catch(() => ({}))
        if (!response.ok) {
          throw new Error(dados?.mensagem || dados?.message || "Não foi possível enviar o e-mail de recuperação.")
        }
        setMensagemRecuperacao(`Se o e-mail ${email} estiver cadastrado, você receberá um link para redefinir sua senha.`)
      } catch (falha) {
        setErroRecuperacao(falha.message || "Não foi possível conectar ao servidor.")
      } finally {
        setEnviandoRecuperacao(false)
      }
    }

    return(
        <>
        <HeaderLogin/>
         <div className="min-h-screen w-full bg-slate-50 pb-24">
 
    
      <div className="flex items-center justify-between px-6 pt-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
            <User size={20} />
          </span>
          <h1 className="text-xl font-bold text-slate-900">Meu perfil</h1>
        </div>
        <button
          type="button"
          onClick={() => setModoEscuro((ativo) => !ativo)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-amber-500 shadow-sm transition hover:scale-105 hover:bg-slate-50"
          aria-label={modoEscuro ? "Ativar modo claro" : "Ativar modo escuro"}
          title={modoEscuro ? "Modo escuro" : "Modo claro"}
        >
          {modoEscuro ? (
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" />
            </svg>
          ) : (
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <circle cx="12" cy="12" r="4" />
              <path strokeLinecap="round" d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
            </svg>
          )}
        </button>
      </div>
 
      <div className="mx-auto max-w-2xl px-6 py-5">
       
        <div className="rounded-xl bg-white p-7 text-center shadow-sm">
          <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-full bg-emerald-50 text-2xl font-bold text-emerald-700">
            {inicial}
          </div>
          <p className="mt-3 text-base font-bold text-slate-900">{nome}</p>
          <p className="text-sm text-slate-500">{email}</p>
        </div>
 
        
        <div className="mt-4 rounded-xl bg-white p-7 shadow-sm">
          <p className="mb-5 text-sm font-bold text-slate-900">Informações pessoais</p>
 
          <label htmlFor="nome" className="mb-1.5 block text-sm font-medium text-slate-700">
            Nome completo
          </label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={nome}
           readOnly
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none"
          />
 
          <label htmlFor="email" className="mb-1.5 mt-4 block text-sm font-medium text-slate-700">
            E-mail
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            readOnly
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none"
          />
 
          {erroRecuperacao && <p role="alert" className="mt-4 text-sm text-red-600">{erroRecuperacao}</p>}
          {mensagemRecuperacao && <p role="status" className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">{mensagemRecuperacao}</p>}
          <button
            type="button"
            onClick={solicitarRedefinicaoSenha}
            disabled={enviandoRecuperacao}
            className="mt-5 w-full rounded-lg bg-emerald-950 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {enviandoRecuperacao ? "Enviando..." : "Fazer alterações"}
          </button>
        </div>
 
       
        <div className="mt-4 rounded-xl bg-white p-7 shadow-sm">
          <p className="mb-4 text-sm font-bold text-slate-900">Últimas compras</p>
          {carregandoPedidos && <p className="text-sm text-slate-500">Carregando compras...</p>}
          {erroPedidos && <p role="alert" className="text-sm text-red-600">{erroPedidos}</p>}
          {!carregandoPedidos && !erroPedidos && pedidos.length === 0 && (
            <p className="rounded-lg border border-slate-200 p-4 text-sm text-slate-500">Você ainda não fez nenhuma compra.</p>
          )}
          {pedidos.map((pedido, indice) => {
            const status = nomeStatus(pedido)
            const ano = pedido.created_at ? new Date(pedido.created_at).getFullYear() : ""
            return (
              <button key={pedido.id} type="button" onClick={() => navigate(`/pedidoDetalhe/${pedido.id}`)}
                className={`flex w-full items-center justify-between rounded-lg border border-slate-200 p-4 text-left transition hover:bg-slate-50 ${indice < pedidos.length - 1 ? "mb-3" : ""}`}>
                <span className="flex items-center gap-3">
                  <Package size={16} />
                  <span>
                    <span className="block text-sm font-semibold text-slate-900">Pedido #QS-{ano}-{String(pedido.id).padStart(4, "0")}</span>
                    <span className="block text-xs text-slate-500">{formatarData(pedido.created_at)} · {formatarPreco(pedido.valor_total)}</span>
                  </span>
                </span>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status.classe}`}>{status.texto}</span>
              </button>
            )
          })}
        </div>
      </div>
      <FooterCatalogo/>
    </div>
        </>
    )
}

export default SectionPerfil
