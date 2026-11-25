import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_URL } from "./api";

function mensagemDeErro(dados, padrao) {
  if (dados?.errors) {
    const primeiro = Object.values(dados.errors)[0];
    if (primeiro?.[0]) return primeiro[0];
  }
  return dados?.mensagem || dados?.message || padrao;
}

function SectionEsqueciSenha() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  async function enviarEmail(e) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const response = await fetch(`${API_URL}/esqueceu-senha`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const dados = await response.json();

      if (!response.ok) {
        const aviso = mensagemDeErro(dados, "Não foi possível enviar o e-mail");
        setErro(aviso);
        toast.error(aviso);
        return;
      }

      setEnviado(true);
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
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900">
              Recuperar senha
            </h2>
            <p className="mt-2 text-xs font-medium uppercase text-slate-500">
              {enviado
                ? "Confira sua caixa de entrada"
                : "Informe o e-mail da sua conta"}
            </p>
          </div>

          {enviado ? (
            <div className="mt-6">
              <p className="rounded-lg bg-emerald-50 p-4 text-sm font-medium text-emerald-900">
                Se o e-mail <strong>{email}</strong> estiver cadastrado, você
                receberá um link para redefinir sua senha. O link vale por 60
                minutos.
              </p>
              <p className="mt-3 text-xs font-normal text-slate-500">
                Não chegou? Veja a caixa de spam ou tente novamente em 1
                minuto.
              </p>

              <button
                type="button"
                onClick={() => setEnviado(false)}
                className="mt-4 w-full rounded-lg border border-emerald-950 py-3 text-sm font-semibold text-emerald-950 hover:bg-emerald-50"
              >
                Enviar para outro e-mail
              </button>
            </div>
          ) : (
            <form onSubmit={enviarEmail} className="mt-6">
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                E-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none"
              />

              {erro && <p className="mt-3 text-sm text-red-600">{erro}</p>}

              <button
                type="submit"
                disabled={carregando}
                className="mt-6 w-full rounded-lg bg-emerald-950 py-3 text-sm font-semibold text-white hover:scale-105 hover:transition hover:duration-300 disabled:opacity-60"
              >
                {carregando ? "Enviando..." : "Enviar link de recuperação"}
              </button>
            </form>
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

export default SectionEsqueciSenha;
