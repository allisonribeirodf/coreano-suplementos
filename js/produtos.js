// Processando o envio do formulário para cadastrar o produto
document.getElementById('form-produto').addEventListener('submit', function(event) {
  event.preventDefault();  // Impede o envio do formulário

  // Coleta os dados do formulário
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
      // Cria um objeto com os dados do produto
      const produto = {
        id: Date.now(),  // ID único com base no timestamp atual
        nome: nomeProduto,
        preco: precoProduto,
        categoria: categoriaProduto,
        temSabores: temSabores,
        sabores: temSabores === 'sim' ? sabores : [],
        imagem: e.target.result
      };

      // Recupera os produtos do localStorage ou cria uma lista nova
      let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
      produtos.push(produto);
      localStorage.setItem('produtos', JSON.stringify(produtos));  // Salva o produto no localStorage

      alert('Produto salvo com sucesso!');
    };
    reader.readAsDataURL(imagemProduto);  // Converte a imagem em uma URL de base64
  } else {
    alert('Por favor, selecione uma imagem.');
  }
});


// Exibindo os produtos cadastrados na página de produtos
window.onload = function() {
  const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
  const listaProdutos = document.getElementById('lista-produtos'); // O container onde os produtos serão exibidos

  // Cria um card para cada produto e exibe os dados
  produtos.forEach(produto => {
    const produtoCard = document.createElement('div');
    produtoCard.classList.add('produto-card'); // Adicione uma classe para estilizar os cards, se necessário

    const imgElement = document.createElement('img');
    imgElement.src = produto.imagem;  // A URL da imagem que foi salva em base64
    imgElement.alt = produto.nome;

    const nomeElement = document.createElement('h3');
    nomeElement.textContent = produto.nome;

    const precoElement = document.createElement('p');
    precoElement.textContent = `R$ ${produto.preco}`;

    // Exibe os sabores, se houver
    const saboresElement = document.createElement('p');
    if (produto.temSabores === 'sim' && produto.sabores.length > 0) {
      // **Adicionar o console.log aqui para verificar os sabores ao exibir o produto**
      console.log(produto.sabores); // Verifica os sabores que estão sendo recuperados

      saboresElement.textContent = `Sabores: ${produto.sabores.join(', ')}`;
    }

    produtoCard.appendChild(imgElement);
    produtoCard.appendChild(nomeElement);
    produtoCard.appendChild(precoElement);
    if (produto.temSabores === 'sim') {
      produtoCard.appendChild(saboresElement);  // Exibe os sabores, caso tenha
    }

    listaProdutos.appendChild(produtoCard);
  });
};
