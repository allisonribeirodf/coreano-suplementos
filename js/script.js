
document.addEventListener('DOMContentLoaded', () => {
  const categorias = {
    'Whey Protein': document.getElementById('whey-produtos'),
    'Creatina': document.getElementById('creatina-produtos'),
    'Pré-Treino': document.getElementById('pre-treino-produtos'),
    'Acessórios': document.getElementById('acessorios-produtos'),
    'Outros': document.getElementById('outros-produtos'),
  };

  produtos.forEach(prod => {
    const card = document.createElement('div');
    card.className = 'produto';
    card.innerHTML = `
      <img src="images/${prod.imagem}" alt="${prod.nome}">
      <h3>${prod.nome}</h3>
      <p>${prod.descricao}</p>
      <p><strong>Preço: ${prod.preco}</strong></p>
      <p style="color: #16a34a;">Desconto exclusivo no WhatsApp!</p>
    `;
    categorias[prod.categoria].appendChild(card);
  });
});
