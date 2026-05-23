// ======================================================
// ARRAYS
// ======================================================

// ===== TRANSAÇÕES =====
const transacoes = [];

// ===== METAS =====
const metas = [];

// ======================================================
// ELEMENTOS FORMULÁRIO
// ======================================================

const form =
  document.getElementById("form-transacao");

const descricaoInput =
  document.getElementById("descricao");

const valorInput =
  document.getElementById("valor");

const tipoInput =
  document.getElementById("tipo");

// ======================================================
// LISTA TRANSAÇÕES
// ======================================================

const listaTransacoes =
  document.getElementById("lista-transacoes");

// ======================================================
// RESUMO FINANCEIRO
// ======================================================

const totalReceitas =
  document.getElementById("total-receitas");

const totalDespesas =
  document.getElementById("total-despesas");

const saldoTotal =
  document.getElementById("saldo-total");

// ======================================================
// METAS
// ======================================================

const nomeMeta =
  document.getElementById("nome-meta");

const objetivoMeta =
  document.getElementById("objetivo-meta");

const btnCriarMeta =
  document.getElementById("btn-criar-meta");

const listaMetas =
  document.getElementById("lista-metas");

// ======================================================
// LIMPAR DADOS
// ======================================================

const btnLimpar =
  document.getElementById("btn-limpar");

// ======================================================
// GRÁFICO
// ======================================================

let grafico;

// ======================================================
// EVENTO FORMULÁRIO
// ======================================================

form.addEventListener("submit", function(event) {

  // ===== EVITA RECARREGAR =====
  event.preventDefault();

  // ===== DADOS =====
  const descricao =
    descricaoInput.value;

  const valor =
    Number(valorInput.value);

  const tipo =
    tipoInput.value;

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

  // ===== ADICIONA =====
  transacoes.push(novaTransacao);

  // ===== RENDERIZA =====
  renderizarTransacoes();

  atualizarResumo();

  // ===== SALVA =====
  salvarDados();

  // ===== LIMPA =====
  form.reset();

});

// ======================================================
// RENDERIZA TRANSAÇÕES
// ======================================================

function renderizarTransacoes() {

  // ===== LIMPA =====
  listaTransacoes.innerHTML = "";

  // ===== PERCORRE =====
  transacoes.forEach(function(transacao) {

    // ===== DIV =====
    const div =
      document.createElement("div");

    // ===== CLASSES =====
    div.classList.add("transacao");

    div.classList.add(transacao.tipo);

    // ===== HTML =====
    div.innerHTML = `

      <div>

        <h3>
          ${transacao.descricao}
        </h3>

        <p>
          R$ ${transacao.valor.toFixed(2)}
        </p>

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

    // ===== ADICIONA =====
    listaTransacoes.appendChild(div);

  });

}

// ======================================================
// EXCLUI TRANSAÇÃO
// ======================================================

function excluirTransacao(id) {

  // ===== ÍNDICE =====
  const indice =
    transacoes.findIndex(
      transacao => transacao.id === id
    );

  // ===== REMOVE =====
  transacoes.splice(indice, 1);

  // ===== ATUALIZA =====
  renderizarTransacoes();

  atualizarResumo();

  // ===== SALVA =====
  salvarDados();

}

// ======================================================
// RESUMO FINANCEIRO
// ======================================================

function atualizarResumo() {

  // ===== RECEITAS =====
  const receitas = transacoes

    .filter(
      transacao =>
        transacao.tipo === "entrada"
    )

    .reduce((acc, transacao) => {

      return acc + transacao.valor;

    }, 0);

  // ===== DESPESAS =====
  const despesas = transacoes

    .filter(
      transacao =>
        transacao.tipo === "saida"
    )

    .reduce((acc, transacao) => {

      return acc + transacao.valor;

    }, 0);

  // ===== SALDO =====
  const saldo =
    receitas - despesas;

  // ===== ATUALIZA =====
  totalReceitas.textContent =
    `R$ ${receitas.toFixed(2)}`;

  totalDespesas.textContent =
    `R$ ${despesas.toFixed(2)}`;

  saldoTotal.textContent =
    `R$ ${saldo.toFixed(2)}`;

  // ===== GRÁFICO =====
  atualizarGrafico(
    receitas,
    despesas
  );

}

// ======================================================
// GRÁFICO
// ======================================================

function atualizarGrafico(
  receitas,
  despesas
) {

  // ===== CANVAS =====
  const ctx =
    document.getElementById(
      "grafico-financeiro"
    );

  // ===== REMOVE ANTIGO =====
  if (grafico) {

    grafico.destroy();

  }

  // ===== NOVO =====
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

    },

    options: {

      responsive: true,

      maintainAspectRatio: false

    }

  });

}

// ======================================================
// CRIAR META
// ======================================================

btnCriarMeta.addEventListener("click", function() {

  // ===== DADOS =====
  const nome =
    nomeMeta.value;

  const objetivo =
    Number(objetivoMeta.value);

  // ===== VALIDAÇÃO =====
  if (
    nome === "" ||
    objetivo <= 0
  ) {

    alert(
      "Preencha os campos corretamente."
    );

    return;

  }

  // ===== NOVA META =====
  const novaMeta = {

    id: Date.now(),

    nome: nome,

    objetivo: objetivo,

    guardado: 0

  };

  // ===== ADICIONA =====
  metas.push(novaMeta);

  // ===== RENDERIZA =====
  renderizarMetas();

  // ===== SALVA =====
  salvarDados();

  // ===== LIMPA =====
  nomeMeta.value = "";

  objetivoMeta.value = "";

});

// ======================================================
// RENDERIZA METAS
// ======================================================

function renderizarMetas() {

  // ===== LIMPA =====
  listaMetas.innerHTML = "";

  // ===== PERCORRE =====
  metas.forEach(function(meta) {

    // ===== PORCENTAGEM =====
    const porcentagem =
      (meta.guardado / meta.objetivo) * 100;

    // ===== DIV =====
    const div =
      document.createElement("div");

    // ===== CLASSE =====
    div.classList.add("item-meta");

    // ===== HTML =====
    div.innerHTML = `

      <div class="topo-meta">

        <h3>
          ${meta.nome}
        </h3>

        <p>
          R$ ${meta.guardado.toFixed(2)}
          /
          R$ ${meta.objetivo.toFixed(2)}
        </p>

      </div>

      <div class="barra-container">

        <div
          class="barra-progresso"
          style="width: ${porcentagem}%"
        ></div>

      </div>

      <p>
        ${porcentagem.toFixed(1)}%
        concluído
      </p>

      <div class="acoes-meta">

        <input
          type="number"
          id="guardar-${meta.id}"
          placeholder="Valor para guardar"
        >

        <button
          onclick="guardarValor(${meta.id})"
        >
          Guardar
        </button>

      </div>

    `;

    // ===== ADICIONA =====
    listaMetas.appendChild(div);

  });

}

// ======================================================
// GUARDAR VALOR
// ======================================================

function guardarValor(id) {

  // ===== INPUT =====
  const input =
    document.getElementById(
      `guardar-${id}`
    );

  // ===== VALOR =====
  const valor =
    Number(input.value);

  // ===== VALIDAÇÃO =====
  if (valor <= 0) {

    alert("Digite um valor válido.");

    return;

  }

  // ===== BUSCA META =====
  const meta =
    metas.find(
      meta => meta.id === id
    );

  // ===== ADICIONA =====
  meta.guardado += valor;

  // ===== ATUALIZA =====
  renderizarMetas();

  // ===== SALVA =====
  salvarDados();

}

// ======================================================
// SALVAR DADOS
// ======================================================

function salvarDados() {

  // ===== TRANSAÇÕES =====
  localStorage.setItem(
    "transacoes",
    JSON.stringify(transacoes)
  );

  // ===== METAS =====
  localStorage.setItem(
    "metas",
    JSON.stringify(metas)
  );

}

// ======================================================
// CARREGAR DADOS
// ======================================================

function carregarDados() {

  // ===== TRANSAÇÕES =====
  const transacoesSalvas =
    localStorage.getItem("transacoes");

  // ===== METAS =====
  const metasSalvas =
    localStorage.getItem("metas");

  // ===== VERIFICA =====
  if (transacoesSalvas) {

    const dados =
      JSON.parse(transacoesSalvas);

    transacoes.push(...dados);

  }

  // ===== VERIFICA =====
  if (metasSalvas) {

    const dados =
      JSON.parse(metasSalvas);

    metas.push(...dados);

  }

  // ===== RENDERIZA =====
  renderizarTransacoes();

  atualizarResumo();

  renderizarMetas();

}

// ======================================================
// LIMPAR DADOS
// ======================================================

btnLimpar.addEventListener("click", function() {

  // ===== CONFIRMA =====
  const confirmar =
    confirm(
      "Deseja realmente apagar todos os dados?"
    );

  // ===== CANCELA =====
  if (!confirmar) {

    return;

  }

  // ===== LIMPA ARRAYS =====
  transacoes.length = 0;

  metas.length = 0;

  // ===== LIMPA STORAGE =====
  localStorage.clear();

  // ===== ATUALIZA =====
  renderizarTransacoes();

  atualizarResumo();

  renderizarMetas();

});

// ======================================================
// INICIAR SISTEMA
// ======================================================

carregarDados();