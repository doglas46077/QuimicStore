import HeaderLogin from "./Header/HeaderLogin";
import { User, Package } from "reicon-react";

function SectionPerfil() {
    return(
        <>
        <HeaderLogin/>
         <div className="min-h-screen w-full bg-slate-50">
 
    
      <div className="flex items-center gap-3 px-6 pt-6">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
          <User size={20} />
        </span>
        <h1 className="text-xl font-bold text-slate-900">Meu perfil</h1>
      </div>
 
      <div className="mx-auto max-w-2xl px-6 py-5">
       
        <div className="rounded-xl bg-white p-7 text-center shadow-sm">
          <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-full bg-emerald-50 text-2xl font-bold text-emerald-700">
            D
          </div>
          <p className="mt-3 text-base font-bold text-slate-900">Dóglas</p>
          <p className="text-sm text-slate-500">professor@fiec.edu.br</p>
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
            defaultValue="Dóglas Vitor Silva"
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none"
          />
 
          <label htmlFor="email" className="mb-1.5 mt-4 block text-sm font-medium text-slate-700">
            E-mail
          </label>
          <input
            type="email"
            id="email"
            name="email"
            defaultValue="professor@fiec.edu.br"
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none"
          />
 
          <label htmlFor="telefone" className="mb-1.5 mt-4 block text-sm font-medium text-slate-700">
            Telefone
          </label>
          <input
            type="text"
            id="telefone"
            name="telefone"
            defaultValue="(19) 99999-0000"
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
    </div>
        </>
    )
}

export default SectionPerfil