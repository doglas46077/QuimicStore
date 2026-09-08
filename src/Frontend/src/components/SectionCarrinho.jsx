import { ShoppingCart } from "reicon-react"
import { ArrowLeft } from "reicon-react"
import { X } from "reicon-react"
import { ShieldCheck } from "reicon-react"
import { Package } from "reicon-react"
import { Truck } from "reicon-react"
import { Headphones } from "reicon-react"
import { Store } from "reicon-react"
import HeaderLogin from "./Header/HeaderLogin"

function SectionCarrinho() {
  return (
    <>
      <HeaderLogin />

      <div className="flex min-h-screen w-full flex-col bg-slate-50">
       <div className="flex-1">
        <div className="flex items-center justify-between px-6 py-6">
       <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                <ShoppingCart className="h-5 w-5 text-emerald-900" />
              </span>
              <h1 className="text-xl font-bold text-slate-900">Meu carrinho</h1>
            </div>

            <button
              type="button"
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-emerald-800 hover:bg-slate-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para a loja
            </button>
          </div>

          <div className="mx-6 rounded-xl bg-white p-16 text-center shadow-sm">
            <div className="relative mx-auto flex h-50 w-50 items-center justify-center rounded-full bg-emerald-50">
              <ShoppingCart className="h-20 w-20 text-emerald-300" strokeWidth={1.5} />
              <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600">
                <X className="h-4 w-4 text-white" />
              </span>
            </div>

            <h2 className="mt-6 text-xl font-bold text-slate-900">
              Seu carrinho está vazio
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Parece que você ainda não adicionou nenhum produto.
              <br />
              Que tal explorar nossas categorias e encontrar o que precisa?
            </p>

            <button
              type="button"
              className="mx-auto mt-6 flex cursor-pointer items-center gap-2 rounded-lg bg-emerald-950 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-900"
            >
              <Store className="h-4 w-4" />
              Explorar produtos
            </button>
          </div>

          <div className="mx-10 mt-10 flex justify-between rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50">
                <ShieldCheck className="h-5 w-5 text-emerald-800" />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-900">Compra segura</p>
                <p className="text-xs text-slate-500">Seus dados protegidos com criptografia</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50">
                <Package className="h-5 w-5 text-emerald-800" />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-900">Produtos de qualidade</p>
                <p className="text-xs text-slate-500">Selecionados especialmente para você</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50">
                <Truck className="h-5 w-5 text-emerald-800" />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-900">Entrega rápida</p>
                <p className="text-xs text-slate-500">Agilidade e segurança em todo pedido</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50">
                <Headphones className="h-5 w-5 text-emerald-800" />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-900">Suporte dedicado</p>
                <p className="text-xs text-slate-500">Estamos prontos para te ajudar</p>
              </div>
            </div>
          </div>
        </div>
        <div className="h-16 bg-emerald-950" />
      </div>
    </>
  );
}

export default SectionCarrinho