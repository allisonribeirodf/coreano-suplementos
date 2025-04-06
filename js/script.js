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
    card.className = 'produto-card';

    card.innerHTML = `
    <img src="images/${prod.imagem}" alt="${prod.nome}">
    <h3>${prod.nome}</h3>
    <p>${prod.descricao}</p>
    <span class="preco">Preço: <strong>${prod.preco}</strong></span>
    <p class="desconto-msg">
      <span class="whatsapp-icon-pulse"></span>
      Seguidores ganham <strong>desconto exclusivo</strong> no WhatsApp!
    </p>
    <div class="botao-container">
      <a href="https://wa.me/5561985402592" target="_blank" class="btn-whatsapp">💬 Comprar</a>
    </div>
  `;  
 
    categorias[prod.categoria].appendChild(card);
  });
});
