// Inicializa o carrinho se não existir
if (!localStorage.getItem("carrinho")) {
  localStorage.setItem("carrinho", JSON.stringify([]));
}

// Atualiza o contador no topo
function atualizarQuantidadeCarrinho() {
  const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  const contador = document.getElementById("quantidade-carrinho");

  if (carrinho.length > 0) {
    contador.innerText = carrinho.length;
    contador.style.display = "inline-block";
  } else {
    contador.innerText = "0";
    contador.style.display = "none";
  }
}

// Adiciona item ao carrinho
function adicionarCarrinhoDinamico(id, nome, preco) {
  const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  const precoNumerico = parseFloat(preco.replace("R$", "").replace(",", ".").trim());
carrinho.push({ id, nome, preco: precoNumerico });

  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  atualizarQuantidadeCarrinho();
  alert(`${nome} adicionado ao carrinho!`);
}

// Carrega itens no modal do carrinho
function carregarCarrinho() {
  const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  const container = document.getElementById("itens-carrinho");
  const resumo = document.getElementById("lista-resumo");
  const totalSpan = document.getElementById("total-pedido");

  container.innerHTML = "";
  resumo.innerHTML = "";

  const agrupado = {};
  carrinho.forEach(item => {
    const key = `${item.nome}|${item.preco}`;
    if (!agrupado[key]) {
      agrupado[key] = { ...item, quantidade: 1 };
    } else {
      agrupado[key].quantidade += 1;
    }
  });

  let total = 0;
  Object.keys(agrupado).forEach(key => {
    const item = agrupado[key];
    const precoTotal = parseFloat(item.preco) * item.quantidade;
    total += precoTotal;

    const div = document.createElement("div");
    div.classList.add("carrinho-item");
    div.innerHTML = `
      <strong>${item.nome}</strong> (x${item.quantidade}) - R$ ${precoTotal.toFixed(2)}
      <button onclick="removerTodosDoMesmoProduto('${key}')">🗑️</button>
    `;
    container.appendChild(div);

    const li = document.createElement("li");
    li.textContent = `${item.nome} (x${item.quantidade}) - R$ ${precoTotal.toFixed(2)}`;
    resumo.appendChild(li);
  });

  totalSpan.innerText = total.toFixed(2);
}

// Remover todos do mesmo produto
function removerTodosDoMesmoProduto(chave) {
  const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  const [nome, preco] = chave.split("|");

  const novoCarrinho = carrinho.filter(item => !(item.nome === nome && String(item.preco) === preco));

  localStorage.setItem("carrinho", JSON.stringify(novoCarrinho));
  carregarCarrinho();
  atualizarQuantidadeCarrinho();
}

// Finaliza compra via WhatsApp
function finalizarCompraCarrinho() {
  const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }

  const mensagem = carrinho.map(item => `${item.nome} - R$ ${item.preco}`).join('\n');
  const total = carrinho.reduce((acc, item) => acc + parseFloat(item.preco), 0).toFixed(2);

  const texto = `Olá! Gostaria de comprar os seguintes produtos:\n\n${mensagem}\n\nTotal: R$ ${total}`;
  const url = `https://wa.me/5561985402592?text=${encodeURIComponent(texto)}`;
  window.open(url, '_blank');
}

// Limpar carrinho inteiro
function limparCarrinho() {
  if (confirm("Tem certeza que deseja remover todos os itens do carrinho?")) {
    localStorage.removeItem("carrinho");
    carregarCarrinho();
    atualizarQuantidadeCarrinho();
  }
}

// Inicializa eventos
document.addEventListener("DOMContentLoaded", () => {
  atualizarQuantidadeCarrinho();

  const cartIcon = document.getElementById("cart-icon");
  const modalCarrinho = document.getElementById("modal-carrinho");
  const backdropModal = document.getElementById("backdrop-modal");

  if (cartIcon && modalCarrinho) {
    cartIcon.addEventListener("click", () => {
      if (modalCarrinho.style.display === "block") {
        modalCarrinho.style.display = "none";
        backdropModal.style.display = "none";
      } else {
        carregarCarrinho();
        modalCarrinho.style.display = "block";
        backdropModal.style.display = "block";
      }
    });
  }

  window.addEventListener("click", (event) => {
    if (event.target === backdropModal) {
      modalCarrinho.style.display = "none";
      backdropModal.style.display = "none";
    }
  });
});
