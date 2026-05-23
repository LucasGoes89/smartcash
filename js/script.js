// ===== ARRAY DE TRANSAÇÕES =====
const transacoes = [];

// ===== ELEMENTOS DO FORMULÁRIO =====
const form = document.getElementById("form-transacao");

const descricaoInput = document.getElementById("descricao");
const valorInput = document.getElementById("valor");
const tipoInput = document.getElementById("tipo");

// ===== ELEMENTOS DA LISTA =====
const listaTransacoes = document.getElementById("lista-transacoes");

// ===== ELEMENTOS DOS CARDS =====
const totalReceitas = document.getElementById("total-receitas");
const totalDespesas = document.getElementById("total-despesas");
const saldoTotal = document.getElementById("saldo-total");

// ===== ELEMENTOS DA META =====
const metaInput = document.getElementById("meta-input");
const btnMeta = document.getElementById("btn-meta");

const metaValor = document.getElementById("meta-valor");
const metaStatus = document.getElementById("meta-status");

const valorCofrinho =
  document.getElementById("valor-cofrinho");

const btnGuardar =
  document.getElementById("btn-guardar");

const valorGuardadoTexto =
  document.getElementById("valor-guardado");

// ===== VARIÁVEIS =====
let metaFinanceira = 0;

let valorGuardado = 0;

let grafico;

// ===== EVENTO DO FORM =====
form.addEventListener("submit", function(event) {

  event.preventDefault();

  // ===== CAPTURA DADOS =====
  const descricao = descricaoInput.value;

  const valor = Number(valorInput.value);

  const tipo = tipoInput.value;

  // ===== VALIDAÇÃO =====
  if (descricao === "" || valor <= 0) {

    alert("Preencha os campos corretamente.");

    return;
  }

  // ===== NOVA TRANSAÇÃO =====
  const novaTransacao = {

    id: Date.now(),

    descricao: descricao,

    valor: valor,

    tipo: tipo

  };

  // ===== ADICIONA NO ARRAY =====
  transacoes.push(novaTransacao);

  // ===== ATUALIZA TELA =====
  renderizarTransacoes();

  atualizarResumo();

  // ===== LIMPA FORM =====
  form.reset();

});

// ===== RENDERIZA TRANSAÇÕES =====
function renderizarTransacoes() {

  // ===== LIMPA LISTA =====
  listaTransacoes.innerHTML = "";

  // ===== PERCORRE ARRAY =====
  transacoes.forEach(function(transacao) {

    // ===== CRIA DIV =====
    const div = document.createElement("div");

    // ===== CLASSES =====
    div.classList.add("transacao");

    div.classList.add(transacao.tipo);

    // ===== HTML INTERNO =====
    div.innerHTML = `

  <div>
    <h3>${transacao.descricao}</h3>

    <p>R$ ${transacao.valor.toFixed(2)}</p>
  </div>

  <div class="acoes-transacao">

    <span>
      ${transacao.tipo === "entrada"
        ? "🟢 Entrada"
        : "🔴 Saída"}
    </span>

    <button
      class="btn-excluir"
      onclick="excluirTransacao(${transacao.id})"
    >
      Excluir
    </button>

  </div>

`;

    // ===== ADICIONA NA LISTA =====
    listaTransacoes.appendChild(div);

  });

}

// ===== ATUALIZA RESUMO =====
function atualizarResumo() {

  // ===== SOMA RECEITAS =====
  const receitas = transacoes

    .filter(transacao => transacao.tipo === "entrada")

    .reduce((acc, transacao) => {

      return acc + transacao.valor;

    }, 0);

  // ===== SOMA DESPESAS =====
  const despesas = transacoes

    .filter(transacao => transacao.tipo === "saida")

    .reduce((acc, transacao) => {

      return acc + transacao.valor;

    }, 0);

  // ===== SALDO =====
  const saldo = receitas - despesas;

  // ===== ATUALIZA CARDS =====
  totalReceitas.textContent =
    `R$ ${receitas.toFixed(2)}`;

  totalDespesas.textContent =
    `R$ ${despesas.toFixed(2)}`;

  saldoTotal.textContent =
    `R$ ${saldo.toFixed(2)}`;

  // ===== ATUALIZA GRÁFICO =====
  atualizarGrafico(receitas, despesas);

  // ===== ATUALIZA META =====
  atualizarMeta();

}

// ===== GRÁFICO =====
function atualizarGrafico(receitas, despesas) {

  const ctx =
    document.getElementById("grafico-financeiro");

  // ===== DESTRÓI GRÁFICO ANTIGO =====
  if (grafico) {

    grafico.destroy();

  }

  // ===== NOVO GRÁFICO =====
  grafico = new Chart(ctx, {

    type: "doughnut",

    data: {

      labels: [
        "Entradas",
        "Saídas"
      ],

      datasets: [{

        data: [
          receitas,
          despesas
        ],

        backgroundColor: [
          "#22c55e",
          "#ef4444"
        ]

      }]

    }

  });

}

// ===== BOTÃO META =====
btnMeta.addEventListener("click", function() {

  metaFinanceira =
    Number(metaInput.value);

  // ===== VALIDAÇÃO =====
  if (metaFinanceira <= 0) {

    alert("Digite uma meta válida.");

    return;

  }

  // ===== ATUALIZA TEXTO =====
  metaValor.textContent =
    `Meta atual: R$ ${metaFinanceira.toFixed(2)}`;

});

// ===== STATUS DA META =====
function atualizarMeta() {

  // ===== SEM META =====
  if (metaFinanceira <= 0) {

    metaStatus.textContent =
      "Nenhuma meta definida.";

    return;

  }

  // ===== PORCENTAGEM =====
  const porcentagem =
    (valorGuardado / metaFinanceira) * 100;

  // ===== META ATINGIDA =====
  if (valorGuardado >= metaFinanceira) {

    metaStatus.textContent =
      "🎉 Parabéns! Você completou sua caixinha.";

  }

  // ===== META EM PROGRESSO =====
  else {

    metaStatus.textContent =
      `💰 Você completou ${porcentagem.toFixed(1)}% da meta.`;

  }

}

// ===== GUARDAR DINHEIRO =====
btnGuardar.addEventListener("click", function() {

  const valor =
    Number(valorCofrinho.value);

  // ===== VALIDAÇÃO =====
  if (valor <= 0) {

    alert("Digite um valor válido.");

    return;

  }

  // ===== SOMA NO COFRINHO =====
  valorGuardado += valor;

  // ===== ATUALIZA TEXTO =====
  valorGuardadoTexto.textContent =
    `Guardado: R$ ${valorGuardado.toFixed(2)}`;

  // ===== LIMPA INPUT =====
  valorCofrinho.value = "";

  // ===== VERIFICA META =====
  atualizarMeta();

});

// ===== EXCLUI TRANSAÇÃO =====
function excluirTransacao(id) {

  const indice =
    transacoes.findIndex(
      transacao => transacao.id === id
    );

  // ===== REMOVE =====
  transacoes.splice(indice, 1);

  // ===== ATUALIZA =====
  renderizarTransacoes();

  atualizarResumo();

}