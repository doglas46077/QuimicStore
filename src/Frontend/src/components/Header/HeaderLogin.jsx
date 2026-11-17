import { useState } from "react";
import {
  FaCircleUser,
  FaMagnifyingGlassMinus,
  FaMagnifyingGlassPlus,
  FaPerson,
} from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

function HeaderLogin() {
  const navigate = useNavigate();
  const [aberto, setAberto] = useState(false);
  const [acessibilidadeAberta, setAcessibilidadeAberta] = useState(false);
  const [escalaFonte, setEscalaFonte] = useState(100);

  function alterarFonte(novaEscala) {
    const escalaLimitada = Math.min(150, Math.max(80, novaEscala));
    setEscalaFonte(escalaLimitada);
    document.documentElement.style.fontSize = `${escalaLimitada}%`;
  }

  let usuario = null;
  try {
    usuario = JSON.parse(localStorage.getItem("usuario") || "null");
  } catch {
    usuario = null;
  }

  const primeiroNome = usuario?.nome?.trim().split(/\s+/)[0] || "Usuário";

  function sair() {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <header className="relative z-10 flex items-center justify-between gap-4 bg-emerald-950 px-4 py-3 sm:px-6">
      <div className="flex shrink-0 items-center gap-2 text-lg font-bold">
        <span className="text-white">Quimic</span>
        <span className="text-amber-400">Store</span>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="relative">
            <button
              type="button"
              aria-expanded={acessibilidadeAberta}
              aria-controls="menu-acessibilidade"
              onClick={() => setAcessibilidadeAberta(!acessibilidadeAberta)}
              className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <FaPerson className="text-amber-300" size={20} />
              <span className="hidden sm:inline">Acessibilidade</span>
            </button>

            {acessibilidadeAberta && (
              <div
                id="menu-acessibilidade"
                role="region"
                aria-label="Acessibilidade"
                className="absolute right-0 top-full z-20 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-2xl"
              >
                <h2 className="text-sm font-semibold">Aumentar fonte  </h2>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    aria-label="Diminuir fonte"
                    disabled={escalaFonte <= 80}
                    onClick={() => alterarFonte(escalaFonte - 10)}
                    className="grid h-10 w-10 place-items-center rounded-lg border border-slate-300 text-emerald-900 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <FaMagnifyingGlassMinus aria-hidden="true" />
                  </button>
                  <span aria-live="polite" className="text-sm font-medium">
                    {escalaFonte}%
                  </span>
                  <button
                    type="button"
                    aria-label="Aumentar fonte"
                    disabled={escalaFonte >= 150}
                    onClick={() => alterarFonte(escalaFonte + 10)}
                    className="grid h-10 w-10 place-items-center rounded-lg border border-slate-300 text-emerald-900 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <FaMagnifyingGlassPlus aria-hidden="true" />
                  </button>
                </div>
                <p className="mt-2 text-xs text-slate-600">
                  Ajuste o tamanho da página.
                </p>
              </div>
            )}
        </div>

        <div className="relative">
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={aberto}
            onClick={() => setAberto(!aberto)}
            className="group flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-2 py-2 text-left transition hover:border-amber-400/60 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 sm:gap-3 sm:px-3"
          >
            <FaCircleUser className="shrink-0 text-amber-300" size={23} />
            <span className="flex flex-col">
              <span className="text-xs leading-4 text-white/65">Olá,</span>
              <span className="max-w-24 truncate text-sm font-semibold text-white sm:max-w-40">
                {primeiroNome}
              </span>
            </span>
            <span
              aria-hidden="true"
              className={`ml-1 text-xs text-white/70 transition-transform ${aberto ? "rotate-180" : ""}`}
            >
              ▾
            </span>
          </button>

          {aberto && (
            <div
              role="menu"
              className="absolute right-0 z-20 mt-3 w-60 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/20 ring-1 ring-black/5"
            >
              <div className="border-b border-slate-100 bg-linear-to-r from-emerald-50 to-white px-4 py-4">
                <p className="text-xs font-medium uppercase tracking-wider text-emerald-800/65">
                  Conta
                </p>
                <p className="mt-1 truncate text-sm font-semibold text-slate-900">
                  {usuario?.nome || "Usuário"}
                </p>
                {usuario?.email && (
                  <p className="mt-0.5 truncate text-xs text-slate-500">
                    {usuario.email}
                  </p>
                )}
              </div>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setAberto(false);
                  navigate("/perfil");
                }}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-900"
              >
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-100 text-emerald-800">
                  ◉
                </span>
                <span>Meu perfil</span>
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={sair}
                className="flex w-full items-center gap-3 border-t border-slate-100 px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-red-50">
                  ↪
                </span>
                <span>Sair da conta</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default HeaderLogin;
