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

function finalizarCompraCarrinho() {
  const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }

  // Agrupar por nome
  const agrupado = {};
  carrinho.forEach(item => {
    if (!agrupado[item.nome]) {
      agrupado[item.nome] = {
        nome: item.nome,
        preco: parseFloat(item.preco),
        quantidade: 1
      };
    } else {
      agrupado[item.nome].quantidade += 1;
    }
  });

  let mensagem = `PEDIDO VIA SITE - COREANO SUPLEMENTOS\n\n`;
  mensagem += `RESUMO DO PEDIDO:\n`;

  let total = 0;
  let index = 1;

  for (const key in agrupado) {
    const item = agrupado[key];
    const subtotal = (item.preco * item.quantidade).toFixed(2);
    total += parseFloat(subtotal);

    mensagem += `${index++}. ${item.nome}\n   Quantidade: ${item.quantidade}\n   Subtotal: R$ ${subtotal}\n\n`;
  }

  mensagem += `TOTAL DO PEDIDO: R$ ${total.toFixed(2)}\n\n`;
  const select = document.getElementById("forma-pagamento");
const formaPagamento = select ? select.value : "Não informado";

mensagem += `Forma de Pagamento: ${formaPagamento}\n\n`;
mensagem += `Gostaria de finalizar este pedido.`;


  const url = `https://wa.me/5561985402592?text=${encodeURIComponent(mensagem)}`;
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
  const whatsappFloat = document.getElementById("whatsapp-flutuante");


  if (cartIcon && modalCarrinho) {
    cartIcon.addEventListener("click", () => {
      const isOpen = modalCarrinho.style.display === "block";
    
      if (isOpen) {
        modalCarrinho.style.display = "none";
        backdropModal.style.display = "none";
        if (whatsappFloat) whatsappFloat.style.display = "inline-block"; // mostra
      } else {
        carregarCarrinho();
        modalCarrinho.style.display = "block";
        backdropModal.style.display = "block";
        if (whatsappFloat) whatsappFloat.style.display = "none"; // esconde
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
