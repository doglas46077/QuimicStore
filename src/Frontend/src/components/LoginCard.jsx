import HeaderLogin from "./Header/HeaderLogin";

function LoginCard() {
  return (

    <main className="w-full h-screen flex justify-center flex-col gap-20 bg-olive-50">
      <HeaderLogin />

      <div className="flex justify-center">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-2xl font-bold">
              <span className="text-slate-900">Quimic</span>
              <span className="text-amber-400">Store</span>
            </div>
            <p className="mt-2 text-xs font-medium uppercase text-slate-500">
              Painel Administrativo
      </p>
          </div>
          <div className="mt-6 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800">
            Acesso restrito para professores e administradores da instituição.
          </div>
          <form className="mt-6">
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="professor@fiec.edu.br"
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none"/>
            <label htmlFor="senha" className="mb-1.5 mt-4 block text-sm font-medium text-slate-700">
              Senha
            </label>
            <input
              type="password"
              id="senha"
              name="senha"
              placeholder="Digite sua senha"
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none"/>
            <button
              type="submit"
              className="mt-6 w-full rounded-lg bg-emerald-950 py-3 text-sm font-semibold text-white hover:scale-105 hover:transition hover:duration-30">
              Entrar
            </button>
          </form>

          <button className="text-sm text-emerald-700 underline w-full text-center hover:scale-105 hover:transition hover:duration-30 ">
            Esqueci minha senha
          </button>
          <div className="my-6 h-px w-full bg-slate-100" />
          <button type="button" className="w-full rounded-lg border border-emerald-700 py-3 text-sm font-semibold text-emerald-800 hover:scale-105 hover:transition hover:duration-30">Voltar à loja</button>

        </div>
      </div>
          <footer className="bg-gray-200 relative z-10 py-6 text-center text-xs text-slate-600">
            © 2024 QuimicStore. Todos os direitos reservados.
          </footer>
    </main>
  );
}

export default LoginCard;
