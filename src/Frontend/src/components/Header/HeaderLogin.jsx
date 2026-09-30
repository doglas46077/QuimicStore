import { useState } from "react";
import { FaCircleUser } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";


function HeaderLogin() {
  const navigate = useNavigate();
  const [aberto, setAberto] = useState(false);

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
          className="flex items-center gap-3"
          onClick={() => setAberto(!aberto)}
        >
          <span className="text-sm text-white/90">Olá, Usuário</span>
          <FaCircleUser className="text-zinc-300" size={20} />
        </button>

        {aberto && (
          <div className="absolute right-0 z-20 mt-3 w-40 rounded-lg bg-white shadow-xl">
            <button
              onClick={() => navigate("/perfil")}
              className="block w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-100"
            >
              Perfil
            </button>

            <button
              onClick={sair}
              className="block w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-slate-100 border-t-2 border-slate-400"
            >
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default HeaderLogin;