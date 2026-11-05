import HeaderLogin from "./Header/HeaderLogin";
import { User, Package } from "reicon-react";
import FooterCatalogo from "./FooterCatalogo"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function SectionPerfil() {
const navigate = useNavigate()

const [nome, setNome] = useState("")
const [email, setEmail] = useState("")
const [modoEscuro, setModoEscuro] = useState(() => localStorage.getItem("modoEscuro") === "true")

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

    const inicial = nome ? nome.charAt(0).toUpperCase() : "?"

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
 
          <label htmlFor="telefone" className="mb-1.5 mt-4 block text-sm font-medium text-slate-700">
            senha
          </label>
          <input
            type="password"
            id="senha"
            name="senha"
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none"
          />
 
          <button
            type="button"
            className="mt-5 w-full rounded-lg bg-emerald-950 py-3 text-sm font-semibold text-white"
          >
            Salvar alterações
          </button>
        </div>
 
       
        <div className="mt-4 rounded-xl bg-white p-7 shadow-sm">
          <p className="mb-4 text-sm font-bold text-slate-900">Últimas compras</p>
 
          
          <div className="mb-3 flex items-center justify-between rounded-lg border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <Package size={16} />
              <div>
                <p className="text-sm font-semibold text-slate-900">Pedido #4521</p>
                <p className="text-xs text-slate-500">12/08/2026 · R$ 189,90</p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              Entregue
            </span>
          </div>
 
        
          <div className="mb-3 flex items-center justify-between rounded-lg border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <Package size={16} />
              <div>
                <p className="text-sm font-semibold text-slate-900">Pedido #4498</p>
                <p className="text-xs text-slate-500">30/07/2026 · R$ 76,50</p>
              </div>
            </div>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
              A caminho
            </span>
          </div>
 
         
          <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <Package size={16} />
              <div>
                <p className="text-sm font-semibold text-slate-900">Pedido #4470</p>
                <p className="text-xs text-slate-500">18/07/2026 · R$ 312,00</p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              Entregue
            </span>
          </div>
        </div>
      </div>
      <FooterCatalogo/>
    </div>
        </>
    )
}

export default SectionPerfil
