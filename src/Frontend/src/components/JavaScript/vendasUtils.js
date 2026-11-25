// Funções da tela de vendas do admin (sem React): formatação, períodos e agrupamentos.

export const STATUS = {
  aprovado: { texto: "Pago", classe: "bg-emerald-100 text-emerald-800" },
  pendente: { texto: "Pendente", classe: "bg-orange-100 text-orange-700" },
  cancelado: { texto: "Cancelado", classe: "bg-red-100 text-red-700" },
};

export const PERIODOS = [
  { valor: "semana", nome: "Semana" },
  { valor: "mes", nome: "Mês" },
  { valor: "ano", nome: "Ano" },
];

export const FILTROS = [
  { valor: "todas", nome: "Todas" },
  { valor: "aprovado", nome: "Pagas" },
  { valor: "pendente", nome: "Pendentes" },
  { valor: "cancelado", nome: "Canceladas" },
];

export function brl(valor) {
  return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function soma(lista, campo) {
  return lista.reduce((total, item) => total + item[campo], 0);
}

export function inicioDoDia(data = new Date()) {
  const d = new Date(data);
  d.setHours(0, 0, 0, 0);
  return d;
}

// ---------------------------------------------------------------------------
// Pedidos do back -> vendas da tela
// ---------------------------------------------------------------------------
function numeroDoPedido(pedido, data) {
  return `#QS-${data.getFullYear()}-${String(pedido.id).padStart(4, "0")}`;
}

// Só pedidos "aprovado" contam como recebido; "pendente" é a receber; "cancelado" não conta.
export function normalizarVendas(pedidos) {
  return pedidos
    .map((pedido) => {
      const data = new Date(pedido.created_at);
      const status = ["aprovado", "cancelado"].includes(pedido.status) ? pedido.status : "pendente";
      const valor = Number(pedido.valor_total) || 0;

      return {
        id: pedido.id,
        num: numeroDoPedido(pedido, data),
        cliente: pedido.usuario?.nome || pedido.cliente_nome || "Cliente desconhecido",
        data,
        status,
        valor,
        recebido: status === "aprovado" ? Number(pedido.pagamento?.valor_pago ?? valor) : 0,
      };
    })
    .filter((venda) => !Number.isNaN(venda.data.getTime()))
    .sort((a, b) => b.data - a.data);
}

// ---------------------------------------------------------------------------
// Períodos (semana começa na segunda)
// ---------------------------------------------------------------------------
export function intervalo(periodo, ancora) {
  const a = inicioDoDia(ancora);

  if (periodo === "semana") {
    const ini = new Date(a);
    ini.setDate(a.getDate() - ((a.getDay() + 6) % 7));
    const fim = new Date(ini);
    fim.setDate(ini.getDate() + 7);
    return [ini, fim];
  }

  if (periodo === "mes") {
    return [new Date(a.getFullYear(), a.getMonth(), 1), new Date(a.getFullYear(), a.getMonth() + 1, 1)];
  }

  return [new Date(a.getFullYear(), 0, 1), new Date(a.getFullYear() + 1, 0, 1)];
}

export function moverAncora(periodo, ancora, delta) {
  const a = new Date(ancora);

  if (periodo === "semana") {
    a.setDate(a.getDate() + 7 * delta);
    return a;
  }

  if (periodo === "mes") return new Date(a.getFullYear(), a.getMonth() + delta, 1);

  return new Date(a.getFullYear() + delta, 0, 1);
}

export function rotuloDoPeriodo(periodo, [ini, fim]) {
  const curto = (d) => d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }).replace(".", "");
  const ultimo = new Date(fim);
  ultimo.setDate(fim.getDate() - 1);

  if (periodo === "semana") return `${curto(ini)} a ${curto(ultimo)} de ${ultimo.getFullYear()}`;

  if (periodo === "mes") {
    const nome = ini.toLocaleDateString("pt-BR", { month: "long" });
    return `${nome.charAt(0).toUpperCase() + nome.slice(1)} de ${ini.getFullYear()}`;
  }

  return String(ini.getFullYear());
}

// ---------------------------------------------------------------------------
// Gráfico: soma o valor recebido por dia (semana/mês) ou por mês (ano)
// ---------------------------------------------------------------------------
const DIAS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

export function montarBaldes(periodo, [ini], pagas) {
  let baldes;

  if (periodo === "semana") {
    baldes = DIAS.map((nome, i) => {
      const d = new Date(ini);
      d.setDate(ini.getDate() + i);
      return { rotulo: `${nome} ${String(d.getDate()).padStart(2, "0")}`, valor: 0, qtd: 0 };
    });
  } else if (periodo === "mes") {
    const dias = new Date(ini.getFullYear(), ini.getMonth() + 1, 0).getDate();
    baldes = Array.from({ length: dias }, (_, i) => ({ rotulo: String(i + 1), valor: 0, qtd: 0 }));
  } else {
    baldes = MESES.map((nome) => ({ rotulo: nome, valor: 0, qtd: 0 }));
  }

  pagas.forEach((venda) => {
    const i =
      periodo === "semana" ? (venda.data.getDay() + 6) % 7
      : periodo === "mes" ? venda.data.getDate() - 1
      : venda.data.getMonth();

    baldes[i].valor += venda.recebido;
    baldes[i].qtd += 1;
  });

  return baldes;
}