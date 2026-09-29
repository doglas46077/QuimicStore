import HeaderLogin from "./Header/HeaderLogin";
import { data, useNavigate } from "react-router-dom";
import { useState } from "react";

function LoginCard() {
 const navigate = useNavigate()

const [email, useEmail] = useState("")
const [senha, useSenha] = useState("")

const [erro, useError] = useState("")
const [carregando, isCarregando] = useState(false)

async function login(e) { 
        e.preventDefault()
        useError("")
        isCarregando(true)

        try{
          const response= await fetch("http://localhost:8000/api/login", {
            method: "POST",
            headers: {"Content-type": "application/json"},
            body:JSON.stringify({email, senha}),
          })

          const guardar = await response.json()

          if(!response.ok) {
            useError(guardar.mensagem || "Erro ao fazer o login")
            return
          }

          console.log(guardar)
          navigate("/catalogo")
        }catch(erro){
          useError("Não foi possivel conectar ao servidor")
        } finally{
          isCarregando(false)
        }
    
}

  return (

    <main className="w-full h-screen flex justify-center flex-col gap-20 bg-olive-50"
    style={{backgroundImage: "url(assets/telaFundo.png)", backgroundRepeat: "no-repeat", backgroundSize: "cover"}}>

      <div className="flex w-full justify-center pt-8">
    <h1 className="text-6xl font-bold">
        <span className="text-slate-900">Quimic</span>{" "}
        <span className="text-amber-400">Store</span>
    </h1>
</div>
      <div className="flex flex-1 justify-center">
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
         
          <form onSubmit={login}
           className="mt-6">
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => useEmail(e.target.value)}
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
              value={senha}
              onChange={(e)=>useSenha(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none"/>

          <button className="text-sm text-emerald-700 underline  w-full text-right hover:transition hover:duration-100 hover:text-blue-800">
            Esqueci minha senha
          </button>
               {erro && <p className="mt-3 text-sm text-red-600">{erro}</p>}

            <button
              type="submit"
              disabled={carregando}
              className="mt-6 w-full rounded-lg bg-emerald-950 py-3 text-sm font-semibold text-white hover:scale-105 hover:transition hover:duration-300 ">
              {carregando ? "Entrando..." : "Entrar"}
            </button>
          </form>


          
          
          <div className="mt-8 flex justify-center items-center gap-1">
            <span>Não tem conta?</span>
          <button onClick={() => navigate("/")}
          className="text-sm text-emerald-700 underline  hover:transition hover:duration-100 hover:text-blue-800">
            Registre-se aqui
          </button>
          </div>

        </div>
      </div>
          <footer className="bg-gray-200 relative z-10 py-6 text-center text-xs text-slate-600">
            © 2026 QuimicStore. Todos os direitos reservados.
          </footer>
    </main>
  );
}

export default LoginCard;
