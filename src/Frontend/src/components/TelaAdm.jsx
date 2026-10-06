import HeaderLogin from "./Header/HeaderLogin";
import FooterCatalogo from "./FooterCatalogo";

function TelaAdm() {
  return (
    <div className="min-h-screen flex flex-col bg-stone-50">

      <HeaderLogin />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8">

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-slate-900">
            Produtos
          </h1>

          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Buscar produto..."
              className="w-56 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-700"
            />

            <button className="rounded-lg bg-emerald-950 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-900">
              + Novo produto
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl bg-white shadow">
          <table className="w-full text-sm">

            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-4 py-3">
                  Produto
                </th>

                <th className="px-4 py-3">
                  Categoria
                </th>

                <th className="px-4 py-3">
                  Preço
                </th>

                <th className="px-4 py-3">
                  Estoque
                </th>

                <th className="px-4 py-3 text-right">
                  Ações
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">

              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-800">
                    Sabonete líquido
                  </p>

                  <p className="text-xs text-slate-400">
                    500ml
                  </p>
                </td>

                <td className="px-4 py-3">
                  <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs text-emerald-700">
                    Higiene
                  </span>
                </td>

                <td className="px-4 py-3 text-slate-700">
                  R$ 18,90
                </td>

                <td className="px-4 py-3 text-slate-700">
                  42
                </td>

                <td className="px-4 py-3 text-right">
                  <button className="mr-3 text-sm text-emerald-700 hover:underline">
                    Editar
                  </button>

                  <button className="text-sm text-red-600 hover:underline">
                    Remover
                  </button>
                </td>
              </tr>

              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-800">
                    Detergente neutro
                  </p>

                  <p className="text-xs text-slate-400">
                    1 litro
                  </p>
                </td>

                <td className="px-4 py-3">
                  <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs text-emerald-700">
                    Limpeza
                  </span>
                </td>

                <td className="px-4 py-3 text-slate-700">
                  R$ 9,50
                </td>

                <td className="px-4 py-3 text-slate-700">
                  6
                </td>

                <td className="px-4 py-3 text-right">
                  <button className="mr-3 text-sm text-emerald-700 hover:underline">
                    Editar
                  </button>

                  <button className="text-sm text-red-600 hover:underline">
                    Remover
                  </button>
                </td>
              </tr>

              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-800">
                    Hidratante corporal
                  </p>

                  <p className="text-xs text-slate-400">
                    250ml
                  </p>
                </td>

                <td className="px-4 py-3">
                  <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs text-emerald-700">
                    Estética
                  </span>
                </td>

                <td className="px-4 py-3 text-slate-700">
                  R$ 24,00
                </td>

                <td className="px-4 py-3 font-bold text-red-700">
                  Esgotado
                </td>

                <td className="px-4 py-3 text-right">
                  <button className="mr-3 text-sm text-emerald-700 hover:underline">
                    Editar
                  </button>

                  <button className="text-sm text-red-600 hover:underline">
                    Remover
                  </button>
                </td>
              </tr>

            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-slate-400">
          Os produtos serão carregados pela API posteriormente.
        </p>

      </main>

      <FooterCatalogo />

    </div>
  );
}

export default TelaAdm;