// Processando o envio do formulário para cadastrar o produto

// Adicionando campo de quantidade no cadastro (opcional, pode ser ignorado na criação do produto)
document.getElementById('form-produto').addEventListener('submit', function(event) {
  event.preventDefault();

  const nomeProduto = document.getElementById('nome-produto').value;
  const precoProduto = document.getElementById('preco-produto').value;
  const categoriaProduto = document.getElementById('categoria-produto').value;
  const temSabores = document.getElementById('tem-sabores').value;

  const sabores = temSabores === 'sim'
    ? document.getElementById('sabores').value.split(',').map(s => s.trim()).filter(s => s !== '')
    : [];

  const imagemProduto = document.getElementById('imagem-produto').files[0];

  if (imagemProduto) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const produto = {
        id: Date.now(),
        nome: nomeProduto,
        preco: precoProduto,
        categoria: categoriaProduto,
        temSabores: temSabores,
        sabores: temSabores === 'sim' ? sabores : [],
        imagem: e.target.result,
        situacao: "ativo"
      };

      console.log("Produto salvo:", produto);

      let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
      produtos.push(produto);
      localStorage.setItem('produtos', JSON.stringify(produtos));

      alert('Produto salvo com sucesso!');
    };
    reader.readAsDataURL(imagemProduto);
  } else {
    alert('Por favor, selecione uma imagem.');
  }
});

// Exibindo os produtos cadastrados na página de produtos
window.onload = function() {
  const todosProdutos = JSON.parse(localStorage.getItem('produtos')) || [];
  const produtos = todosProdutos.filter(p => p.situacao === "ativo");

  const listaProdutos = document.getElementById('lista-produtos');

  produtos.forEach(produto => {
    const produtoCard = document.createElement('div');
    produtoCard.classList.add('produto-card');

    const imgElement = document.createElement('img');
    imgElement.src = produto.imagem;
    imgElement.alt = produto.nome;

    const nomeElement = document.createElement('h3');
    nomeElement.textContent = produto.nome;

    const precoElement = document.createElement('p');
    precoElement.textContent = `R$ ${produto.preco}`;

    const saboresElement = document.createElement('p');
    if (produto.temSabores === 'sim' && produto.sabores.length > 0) {
      saboresElement.textContent = `Sabores: ${produto.sabores.join(', ')}`;
    }

    const btnComprar = document.createElement('button');
    btnComprar.textContent = 'Comprar';
    btnComprar.onclick = () => abrirModalProduto(produto);

    produtoCard.appendChild(imgElement);
    produtoCard.appendChild(nomeElement);
    produtoCard.appendChild(precoElement);
    if (produto.temSabores === 'sim') {
      produtoCard.appendChild(saboresElement);
    }
    produtoCard.appendChild(btnComprar);

    listaProdutos.appendChild(produtoCard);
  });
};

// Função que abre o modal preenchido com os dados do produto
function abrirModalProduto(produto) {
  document.getElementById("modal-nome-produto").textContent = produto.nome;
  document.getElementById("modal-preco-produto").textContent = `R$ ${produto.preco}`;
  document.getElementById("modal-sabor-produto").innerHTML = "";

  if (produto.temSabores === "sim") {
    document.getElementById("modal-sabor-produto").disabled = false;
    const select = document.getElementById("modal-sabor-produto");
    const optionDefault = document.createElement("option");
    optionDefault.value = "";
    optionDefault.textContent = "Selecione";
    select.appendChild(optionDefault);
    produto.sabores.forEach(sabor => {
      const option = document.createElement("option");
      option.value = sabor;
      option.textContent = sabor;
      select.appendChild(option);
    });
  } else {
    document.getElementById("modal-sabor-produto").disabled = true;
  }

  document.getElementById("quantidade-produto").value = 1;

  document.getElementById("modal-produto").style.display = "block";
  document.getElementById("backdrop-modal").style.display = "block";
}

function fecharModalProduto() {
  document.getElementById("modal-produto").style.display = "none";
  document.getElementById("backdrop-modal").style.display = "none";
}

function adicionarAoCarrinho() {
  const nome = document.getElementById("modal-nome-produto").textContent;
  const preco = document.getElementById("modal-preco-produto").textContent.replace("R$", "").trim();
  const sabor = document.getElementById("modal-sabor-produto").value;
  const quantidade = parseInt(document.getElementById("quantidade-produto").value) || 1;

  const nomeFinal = sabor ? `${nome} - ${sabor}` : nome;

  for (let i = 0; i < quantidade; i++) {
    adicionarCarrinhoDinamico(Date.now() + i, nomeFinal, preco);
  }

  fecharModalProduto();
  alert(`${quantidade}x ${nomeFinal} adicionado(s) ao carrinho!`);
}
