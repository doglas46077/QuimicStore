import { ArrowLeft } from "reicon-react";
import { useNavigate } from "react-router-dom";

export default function HeaderPedidoStatus() {
  const navigate = useNavigate()
    return (
        <header className="flex items-center justify-between gap-6 bg-emerald-950 px-6 py-3">
      <div className="flex items-center gap-2 text-lg font-bold">
        <span className="text-white">Quimic</span>
        <span className="text-amber-400">Store</span>
      </div>
      
      <div className="flex items-center gap-4">
        <button onClick={()=>navigate("/pedidoStatus")} className="flex text-white items-center gap-2 bg-white/20 p-2 rounded-lg hover:scale-105 transition-transform">
            <ArrowLeft size={24} />
            Voltar
        </button>
      </div>
    </header>
    );
}