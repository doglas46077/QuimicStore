import { FaCircleUser } from "react-icons/fa6";

function HeaderLogin() {
  return (
    <header className="flex items-center justify-between gap-6 bg-emerald-950 px-6 py-3">
      <div className="flex items-center gap-2 text-lg font-bold">
        <span className="text-white">Quimic</span>
        <span className="text-amber-400">Store</span>
      </div>
      
      <div className="flex items-center gap-4">
        <span className="text-sm text-white/90">Olá, Usuário</span>
 
        <div aria-disabled="true" className="pointer-events-none flex h-8 w-8 items-center justify-center rounded-full">
          
    <FaCircleUser className="text-zinc-300" size={20}/>    
        </div>
      </div>
    </header>
  );
}
export default HeaderLogin;