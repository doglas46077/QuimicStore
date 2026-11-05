import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { API_URL } from "./api";

const MIN_SENHA = 8;

function mensagemDeErro(dados, padrao) {
  if (dados?.errors) {
    const primeiro = Object.values(dados.errors)[0];
    if (primeiro?.[0]) return primeiro[0];
  }
  return dados?.mensagem || dados?.message || padrao;
}

function SectionRedefinirSenha() {
  const navigate = useNavigate();

  const [params] = useSearchParams();
  const token = params.get("token");
  const email = params.get("email");

  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [linkInvalido, setLinkInvalido] = useState(!token || !email);

  async function redefinir(e) {
    e.preventDefault();
    setErro("");

    if (senha.length < MIN_SENHA) {
      setErro(`A senha precisa ter no mínimo ${MIN_SENHA} caracteres`);
      return;
    }

    if (senha !== confirmacao) {
      setErro("As senhas não coincidem");
      return;
    }

    setCarregando(true);

    try {
      const response = await fetch(`${API_URL}/resetar-senha`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          token,
          email,
          senha,
          senha_confirmation: confirmacao,
        }),
      });

      const dados = await response.json();

      if (response.status === 400) {
        setLinkInvalido(true);
        return;
      }

      if (!response.ok) {
        const aviso = mensagemDeErro(dados, "Erro ao redefinir a senha");
        setErro(aviso);
        toast.error(aviso);
        return;
      }

      toast.success(dados.mensagem || "Senha redefinida com sucesso");
      navigate("/login");
    } catch {
      const aviso = "Não foi possível conectar ao servidor";
      setErro(aviso);
      toast.error(aviso);
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
        backgroundSize: "cover",
      }}
    >
      <div className="flex w-full justify-center pt-8">
        <h1 className="text-6xl font-bold">
          <span className="text-slate-900">Quimic</span>{" "}
          <span className="text-amber-400">Store</span>
        </h1>
      </div>

      <div className="flex flex-1 justify-center">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl h-fit">
          {linkInvalido ? (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-900">
                Link inválido
              </h2>
              <p className="mt-4 rounded-lg bg-red-50 p-4 text-sm font-medium text-red-700">
                Este link de recuperação é inválido, expirou ou já foi
                utilizado
              </p>
              <button
                type="button"
                onClick={() => navigate("/esqueci-senha")}
                className="mt-6 w-full rounded-lg bg-emerald-950 py-3 text-sm font-semibold text-white hover:scale-105 hover:transition hover:duration-300"
              >
                Solicitar novo link
              </button>
            </div>
          ) : (
            <>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-900">
                  Nova senha
                </h2>
                <p className="mt-2 text-xs font-medium uppercase text-slate-500">
                  Conta: {email}
                </p>
              </div>

              <form onSubmit={redefinir} className="mt-6">
                <label
                  htmlFor="senha"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Nova senha
                </label>
                <input
                  type={mostrarSenha ? "text" : "password"}
                  id="senha"
                  name="senha"
                  placeholder={`Mínimo de ${MIN_SENHA} caracteres`}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none"
                />

                <label
                  htmlFor="confirmacao"
                  className="mb-1.5 mt-4 block text-sm font-medium text-slate-700"
                >
                  Confirmar nova senha
                </label>
                <input
                  type={mostrarSenha ? "text" : "password"}
                  id="confirmacao"
                  name="confirmacao"
                  placeholder="Repita a nova senha"
                  value={confirmacao}
                  onChange={(e) => setConfirmacao(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none"
                />

                <button
                  type="button"
                  onClick={() => setMostrarSenha((v) => !v)}
                  aria-pressed={mostrarSenha}
                  className="mt-2 w-full text-right text-sm text-emerald-700 underline hover:transition hover:duration-100 hover:text-blue-800"
                >
                  {mostrarSenha ? "Ocultar senhas" : "Mostrar senhas"}
                </button>

                {erro && <p className="mt-3 text-sm text-red-600">{erro}</p>}

                <button
                  type="submit"
                  disabled={carregando}
                  className="mt-6 w-full rounded-lg bg-emerald-950 py-3 text-sm font-semibold text-white hover:scale-105 hover:transition hover:duration-300 disabled:opacity-60"
                >
                  {carregando ? "Salvando..." : "Redefinir senha"}
                </button>
              </form>
            </>
          )}

          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-sm text-emerald-700 underline hover:transition hover:duration-100 hover:text-blue-800"
            >
              Voltar para o login
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

export default SectionRedefinirSenha;
