import { useNavigate } from "react-router-dom";
import HeaderLogin from "./Header/HeaderLogin";
import { useState } from "react";

function SectionCadastro() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    async function cadastrar(e) {

        e.preventDefault();

        setErro("");
        setCarregando(true);

        try {

            const resposta = await fetch(
                "http://127.0.0.1:8000/api/cadastro",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        senha: senha
                    })
                }
            );

            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(
                    dados.message || "Erro ao realizar cadastro"
                );
            }

            console.log("Usuário cadastrado:", dados);

            alert("Cadastro realizado com sucesso!");

            navigate("/catalogo");

        } catch (error) {

            console.error(error);

            setErro(error.message);

        } finally {

            setCarregando(false);

        }
    }

    return (
        <main
            className="w-full h-screen flex justify-center flex-col gap-20 bg-olive-50"
            style={{
                backgroundImage: "url(assets/telaFundo.png)",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover"
            }}
        >

            <HeaderLogin />

            <div className="flex flex-1 justify-center">

                <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">

                    <div className="text-center">

                        <div className="flex items-center justify-center gap-2 text-2xl font-bold">

                            <span className="text-slate-900">
                                Quimic
                            </span>

                            <span className="text-amber-400">
                                Store
                            </span>

                        </div>

                        <p className="mt-2 text-xs font-medium uppercase text-slate-500">
                            Painel Administrativo
                        </p>

                    </div>

                    <form
                        className="mt-6"
                        onSubmit={cadastrar}
                    >

                        <label
                            htmlFor="nome"
                            className="mb-1.5 mt-4 block text-sm font-medium text-slate-700"
                        >
                            Digite seu Nome
                        </label>

                        <input
                            type="text"
                            id="nome"
                            name="nome"
                            placeholder="Digite seu nome"
                            required
                            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none"
                        />

                        <label
                            htmlFor="email"
                            className="mb-1.5 mt-4 block text-sm font-medium text-slate-700"
                        >
                            E-mail
                        </label>

                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Digite seu email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none"
                        />

                        <label
                            htmlFor="senha"
                            className="mb-1.5 mt-4 block text-sm font-medium text-slate-700"
                        >
                            Crie sua Senha
                        </label>

                        <input
                            type="password"
                            id="senha"
                            name="senha"
                            placeholder="Digite sua senha"
                            required
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none"
                        />

                        {erro && (
                            <p className="mt-3 text-sm text-red-600">
                                {erro}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={carregando}
                            className="mt-6 w-full rounded-lg bg-emerald-950 py-3 text-sm font-semibold text-white hover:scale-105 hover:transition hover:duration-300"
                        >
                            {carregando
                                ? "Cadastrando..."
                                : "Cadastrar"
                            }
                        </button>

                    </form>

                    <div className="mt-8 flex justify-center items-center gap-1">

                        <span>
                            Já tem conta?
                        </span>

                        <button
                            onClick={() => navigate("/login")}
                            className="text-sm text-emerald-700 underline hover:transition hover:duration-100 hover:text-blue-800"
                        >
                            Faça login
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

export default SectionCadastro;