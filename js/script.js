// ===== ARRAY DE TRANSAÇÕES =====
const transacoes = [];

// ===== ELEMENTOS =====
const form = document.getElementById("form-transacao");

const descricaoInput = document.getElementById("descricao");
const valorInput = document.getElementById("valor");
const tipoInput = document.getElementById("tipo");

const listaTransacoes = document.getElementById("lista-transacoes");

const totalReceitas = document.getElementById("total-receitas");
const totalDespesas = document.getElementById("total-despesas");
const saldoTotal = document.getElementById("saldo-total");

// ===== EVENTO DO FORMULÁRIO =====
form.addEventListener("submit", function (event) {

  event.preventDefault();

  // ===== CAPTURA DOS DADOS =====
  const descricao = descricaoInput.value;
  const valor = Number(valorInput.value);
  const tipo = tipoInput.value;

  // ===== NOVA TRANSAÇÃO =====
  const novaTransacao = {
    id: Date.now(),
    descricao,
    valor,
    tipo
  };

  // ===== ADICIONA AO ARRAY =====
  transacoes.push(novaTransacao);

  // ===== ATUALIZA INTERFACE =====
  renderizarTransacoes();
  atualizarResumo();

  // ===== LIMPA FORM =====
  form.reset();

});

// ===== RENDERIZA TRANSAÇÕES =====
function renderizarTransacoes() {

  listaTransacoes.innerHTML = "";

  transacoes.forEach(function (transacao) {

    const div = document.createElement("div");

    div.classList.add("transacao");
    div.classList.add(transacao.tipo);

    div.innerHTML = `
      <div>
        <h3>${transacao.descricao}</h3>
        <p>R$ ${transacao.valor.toFixed(2)}</p>
      </div>

      <div>
        ${transacao.tipo === "entrada" ? "🟢 Entrada" : "🔴 Saída"}
      </div>
    `;

    listaTransacoes.appendChild(div);

  });

}

// ===== ATUALIZA RESUMO =====
function atualizarResumo() {

  const receitas = transacoes
    .filter(transacao => transacao.tipo === "entrada")
    .reduce((acc, transacao) => acc + transacao.valor, 0);

  const despesas = transacoes
    .filter(transacao => transacao.tipo === "saida")
    .reduce((acc, transacao) => acc + transacao.valor, 0);

  const saldo = receitas - despesas;

  totalReceitas.textContent = `R$ ${receitas.toFixed(2)}`;

  totalDespesas.textContent = `R$ ${despesas.toFixed(2)}`;

  saldoTotal.textContent = `R$ ${saldo.toFixed(2)}`;

}