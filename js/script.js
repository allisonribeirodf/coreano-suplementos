document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("produtos-container");
  if (!container) return;

  const categoria = window.location.pathname.split("/").pop().replace(".html", "").replace("-", " ");
  const categoriaFormatada = categoria.charAt(0).toUpperCase() + categoria.slice(1);

  fetch("produtos.json")
    .then(res => res.json())
    .then(produtos => {
      const filtrados = produtos.filter(p => p.categoria.toLowerCase() === categoriaFormatada.toLowerCase());

      if (filtrados.length === 0) {
        container.innerHTML = "<p>Nenhum produto encontrado para esta categoria.</p>";
        return;
      }

      filtrados.forEach(prod => {
        const card = document.createElement("div");
        card.className = "produto-card";
        card.innerHTML = `
          <img src="images/${prod.imagem}" alt="${prod.nome}">
          <h3>${prod.nome}</h3>
          <p>${prod.descricao}</p>
          <span class="preco">Preço: <strong>R$ ${parseFloat(prod.preco).toFixed(2).replace(".", ",")}</strong></span>
          <button class="btn-comprar-direto" data-prod='${JSON.stringify(prod)}'>💬 Comprar</button>
        `;
        container.appendChild(card);
      });
    })
    .catch(erro => {
      container.innerHTML = "<p>Erro ao carregar os produtos.</p>";
      console.error(erro);
    });
});

// Ação do botão "Comprar"
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-comprar-direto")) {
    const data = JSON.parse(e.target.getAttribute("data-prod"));
    abrirModalProduto(data);
  }
});

// ------------------ MODAL ------------------

function abrirModalProduto(produto) {
  const modal = document.createElement("div");
  modal.className = "mini-modal";

  let saboresHTML = "";
  if (produto.temSabores === "sim" && produto.sabores?.length > 0) {
    saboresHTML = `
      <div class="sabor-box">
        <h4>Sabor</h4>
        <select class="sabor-select">
          ${produto.sabores.map(s => `<option value="${s}">${s}</option>`).join("")}
        </select>
      </div>
    `;
  }

  modal.innerHTML = `
    <img src="images/${produto.imagem}" alt="${produto.nome}" style="max-width: 140px; margin-bottom: 0.5rem;" />
    <h3>${produto.nome}</h3>
    <p style="font-weight: bold; font-size: 1.1rem;">R$ ${parseFloat(produto.preco).toFixed(2).replace(".", ",")}</p>
    ${saboresHTML}
    <div style="margin-top: 1rem;">
      <button onclick='confirmarCompraDireta(this)' data-prod='${JSON.stringify(produto)}'>Adicionar ao Carrinho</button>
      <button onclick='fecharModal()' style="margin-left: 1rem;">Fechar</button>
    </div>
  `;

  Object.assign(modal.style, {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: "1000",
    background: "#fff",
    padding: "1.5rem",
    borderRadius: "12px",
    boxShadow: "0 0 15px rgba(0,0,0,0.3)",
    textAlign: "center"
  });

  document.body.appendChild(modal);
  document.getElementById("backdrop-modal").style.display = "block";
}

function fecharModal() {
  const modal = document.querySelector(".mini-modal");
  if (modal) modal.remove();
  document.getElementById("backdrop-modal").style.display = "none";
}

function confirmarCompraDireta(botao) {
  const produto = JSON.parse(botao.getAttribute("data-prod"));
  let nomeFinal = produto.nome;

  const saborSelect = botao.closest(".mini-modal").querySelector(".sabor-select");
  if (saborSelect) {
    nomeFinal += ` - ${saborSelect.value}`;
  }

  adicionarCarrinhoDinamico(produto.id, nomeFinal, produto.preco);
  fecharModal();
}
