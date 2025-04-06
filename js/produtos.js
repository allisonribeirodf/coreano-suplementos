// Função para gerar ID único baseado no timestamp
function gerarIdUnico() {
  return Date.now();
}

// Função para salvar o produto no localStorage
function salvarProduto() {
  const nome = document.getElementById('nome-produto').value.trim();
  const preco = parseFloat(document.getElementById('preco-produto').value);
  const categoria = document.getElementById('categoria-produto').value;
  const imagemInput = document.getElementById('imagem-produto');
  const imagem = imagemInput.files[0];

  if (!nome || isNaN(preco) || !categoria || !imagem) {
    alert('Por favor, preencha todos os campos e selecione uma imagem.');
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const produto = {
      id: gerarIdUnico(),
      nome,
      preco,
      categoria,
      imagem: e.target.result // Salva a imagem em Base64
    };

    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    produtos.push(produto);
    localStorage.setItem('produtos', JSON.stringify(produtos));

    alert('Produto salvo com sucesso!');
    document.getElementById('form-produto').reset();
  };

  reader.readAsDataURL(imagem);
}
