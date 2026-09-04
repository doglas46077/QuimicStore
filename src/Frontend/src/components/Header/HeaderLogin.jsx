function HeaderLogin() {
  return (
    <header className="flex items-center justify-between gap-6 bg-emerald-950 px-6 py-3">
      <div className="flex items-center gap-2 text-lg font-bold">
        <span className="text-white">Quimic</span>
        <span className="text-amber-400">Store</span>
      </div>
      
      <div className="flex items-center gap-4">
        <span className="text-sm text-white/90">Olá, Usuário</span>
 
       
 
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
export default HeaderLogin;