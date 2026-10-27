import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { QRCodeSVG } from "qrcode.react";
import { ShieldCheck } from "reicon-react";
import HeaderLogin from "./Header/HeaderLogin";
import FooterCatalogo from "./FooterCatalogo";
import { useCarrinho } from "./JavaScript/carrinhoAnimacao";

function formatarPreco(valor) {
  return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function lerSalvo(chave) {
  try {
    return JSON.parse(sessionStorage.getItem(chave));
  } catch {
    return null;
  }
}

function PagamentoPix() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();
  const { limpar } = useCarrinho();

  const pedido = state?.pedido || lerSalvo(`pedido:${id}`);
  const codigoPix = pedido?.pagamento?.pix_copia_cola;

  useEffect(() => {
    if (!pedido) navigate("/pedidos", { replace: true });
  }, []);

  async function copiarCodigo() {
    try {
      await navigator.clipboard.writeText(codigoPix);
      toast.success("Código Pix copiado");
    } catch (e) {
      toast.error("Não foi possível copiar. Selecione o código e copie manualmente.");
    }
  }

  if (!pedido) return null;

  return (
    <>
      <HeaderLogin />

      <div className="flex min-h-screen w-full flex-col bg-slate-50 pb-24">
        <div className="flex-1">
          <div className="flex items-center justify-between px-6 py-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                <ShieldCheck className="h-5 w-5 text-emerald-900" />
              </span>
              <h1 className="text-xl font-bold text-slate-900">Pagamento via Pix</h1>
            </div>

            <button
              onClick={() => navigate("/pedidos")}
              type="button"
              className="cursor-pointer rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-emerald-800 hover:bg-slate-300"
            >
              Ver meus pedidos
            </button>
          </div>

          <div className="mx-6 grid gap-4 md:grid-cols-2">
            
            <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
              <p className="text-sm font-normal text-slate-500">Pedido #{pedido.id}</p>
              <p className="mt-1 text-3xl font-bold text-emerald-700">{formatarPreco(pedido.valor_total)}</p>

              <span className="mt-3 inline-block rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                Aguardando pagamento
              </span>

              {codigoPix ? (
                <>
                  <div className="mx-auto mt-5 w-fit rounded-xl border border-slate-200 bg-white p-5">
                    <QRCodeSVG value={codigoPix} size={200} level="M" />
                  </div>

                  <div className="mt-5 text-left">
                    <p className="mb-1.5 text-sm font-medium text-slate-700">Pix copia e cola</p>
                    <textarea
                      readOnly
                      rows={3}
                      value={codigoPix}
                      onFocus={(e) => e.target.select()}
                      className="w-full resize-none break-all rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-normal text-slate-600 outline-none"
                    />
                    <button
                      type="button"
                      onClick={copiarCodigo}
                      className="mt-2 w-full cursor-pointer rounded-lg bg-emerald-950 py-3 text-sm font-semibold text-white hover:bg-emerald-900"
                    >
                      Copiar código
                    </button>
                  </div>
                </>
              ) : (
                <p className="mt-6 rounded-lg bg-slate-50 p-4 text-sm font-normal text-slate-600">
                  Este pedido não tem um código Pix. Veja o andamento em "Ver meus pedidos".
                </p>
              )}
            </div>
            
            <div className="flex h-fit flex-col gap-4">
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="mb-3 text-sm font-bold text-slate-900">Como pagar</p>
                <ol className="flex list-decimal flex-col gap-2 pl-5 text-sm font-normal text-slate-600">
                  <li>Abra o aplicativo do seu banco e escolha Pix.</li>
                  <li>Leia o QR Code ou use o Pix copia e cola.</li>
                  <li>Confira o valor e conclua o pagamento.</li>
                  <li>Volte aqui e toque em "Já paguei".</li>
                </ol>
              </div>

              {codigoPix && (
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <p className="mb-1 text-sm font-bold text-slate-900">Já fez o pagamento?</p>
                  <p className="mb-4 text-xs font-normal text-slate-500">
                    A equipe da loja confirma o pagamento. Na próxima tela você acompanha o status do pedido,
                    que atualiza sozinho.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      limpar();
                      navigate(`/pedido-realizado/${id}`);
                    }}
                    className="w-full cursor-pointer rounded-lg bg-emerald-950 py-3 text-sm font-semibold text-white hover:bg-emerald-900"
                  >
                    Já paguei
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <FooterCatalogo />
      </div>
    </>
  );
}

export default PagamentoPix;
