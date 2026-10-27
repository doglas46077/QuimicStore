import { useState } from "react";
import { FaCircleUser } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";


function HeaderLogin() {
  const navigate = useNavigate();
  const [aberto, setAberto] = useState(false);

  const usuario = JSON.parse(localStorage.getItem("usuario")|| "null")
  const adm = usuario?.nivel_acesso === "professor" || usuario?.nivel_acesso === "estagiario"
  const primeiroNome = usuario?.nome?.trim().split(/\s+/)[0] || "Usuário"

  function sair(){
    localStorage.removeItem("usuario")
      localStorage.removeItem("token")
      navigate("/login")
  }

  return (
    <header className="flex items-center justify-between bg-emerald-950 px-6 py-3">
      <div className="flex items-center gap-2 text-lg font-bold">
        <span className="text-white">Quimic</span>
        <span className="text-amber-400">Store</span>
      </div>

      <div className="relative">
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={aberto}
          onClick={() => setAberto(!aberto)}
          className="group flex items-center gap-3 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-left transition hover:border-amber-400/60 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          <FaCircleUser className="shrink-0 text-amber-300" size={23} />
          <span className="flex flex-col">
            <span className="text-xs leading-4 text-white/65">Olá,</span>
            <span className="max-w-40 truncate text-sm font-semibold text-white">{primeiroNome}</span>
          </span>
          <span aria-hidden="true" className={`ml-1 text-xs text-white/70 transition-transform ${aberto ? "rotate-180" : ""}`}>▾</span>
        </button>

        {aberto && (
          <div role="menu" className="absolute right-0 z-20 mt-3 w-60 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/20 ring-1 ring-black/5">
            <div className="border-b border-slate-100 bg-linear-to-r from-emerald-50 to-white px-4 py-4">
              <p className="text-xs font-medium uppercase tracking-wider text-emerald-800/65">Conta</p>
              <p className="mt-1 truncate text-sm font-semibold text-slate-900">{usuario?.nome || "Usuário"}</p>
              {usuario?.email && <p className="mt-0.5 truncate text-xs text-slate-500">{usuario.email}</p>}
            </div>
            <button
              role="menuitem"
              onClick={() => { setAberto(false); navigate("/perfil"); }}
              className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-900"
            >
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-100 text-emerald-800">◎</span>
              <span>Meu perfil</span>g
            </button>

            <button
              role="menuitem"
              onClick={sair}
              className="flex w-full items-center gap-3 border-t border-slate-100 px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-red-50">↪</span>
              <span>Sair da conta</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default HeaderLogin;
