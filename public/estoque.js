document.addEventListener('DOMContentLoaded', async () => {
  const tabela = document.getElementById('product-list');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  try {
    const res = await fetch('/produtos');
    const produtos = await res.json();

    tabela.innerHTML = '';

    produtos.forEach(produto => {
      const linha = document.createElement('tr');

      linha.innerHTML = `
        <td>${produto.nome}</td>
        <td>R$ ${produto.preco.toFixed(2)}</td>
        <td>${produto.quantidade}</td>
        <td>${produto.tipo}</td>
        <td class="actions">
          ${isAdmin ? `<button onclick="removerProduto('${produto._id}')">Remover</button>` : ''}
        </td>
      `;

      tabela.appendChild(linha);
    });

  } catch (err) {
    console.error('Erro ao carregar produtos:', err);
    tabela.innerHTML = '<tr><td colspan="5">Erro ao carregar produtos</td></tr>';
  }
});

async function removerProduto(id) {
  if (!confirm('Tem certeza que deseja remover este produto?')) return;

  try {
    const res = await fetch(`/produtos/${id}`, {
      method: 'DELETE'
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.message);
      location.reload();
    } else {
      alert('Erro ao remover: ' + data.message);
    }
  } catch (err) {
    console.error('Erro ao remover produto:', err);
    alert('Erro ao remover produto!');
  }
}
