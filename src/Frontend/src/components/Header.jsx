import { CartLarge5 } from 'reicon-react';
import { User } from 'reicon-react';

function Header() {
  return (
    <header className="flex items-center justify-between gap-6 bg-emerald-950 px-6 py-3">
      <div className="flex items-center gap-2 text-lg font-bold">
        <span className="text-white">Quimic</span>
        <span className="text-amber-400">Store</span>
      </div>

      <img src="logo.png" alt="" />
            <div className="flex gap-9 border-r-9 border-green-950 items-center">
                <p className="flex justify-center text-center">Olá, usuario</p>
                <div className="flex gap-4 items-center">
                    <CartLarge5 size={34} />
                    <div className="flex justify-center bg-green-200 rounded-full w-10 h-10 items-center text-black">
                        <User size={30} />
                    </div>

                    <img src="perfil.jpg" alt="" className="rounded-full"/>
                </div>
            </div>
 
      
 
      <div className="flex items-center gap-4">
        <span className="text-sm text-white/90">Olá, Vitor</span>
 
        <div aria-disabled="true" className="pointer-events-none relative">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400 text-[10px] font-semibold text-emerald-950">
            0
          </span>
        </div>
 
        <div
          aria-disabled="true"
          className="pointer-events-none flex h-8 w-8 items-center justify-center rounded-full bg-white/10"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.5-6 8-6s8 2 8 6" />
          </svg>
        </div>
      </div>
    </header>
  );
}
export default Header;