document.getElementById('cadastro-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const preco = parseFloat(document.getElementById('preco').value);
  const quantidade = parseInt(document.getElementById('quantidade').value, 10);
  const tipo = document.getElementById('tipo').value.trim();

  if (!nome || isNaN(preco) || preco < 0 || isNaN(quantidade) || quantidade < 1 || !tipo) {
    alert('Por favor, preencha todos os campos corretamente.');
    return;
  }

  try {
    const res = await fetch('/produtos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, preco, quantidade, tipo }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      alert('Erro ao cadastrar: ' + (errorData.message || 'Erro desconhecido'));
      return;
    }

    alert('Produto cadastrado com sucesso!');
    event.target.reset();
  } catch (err) {
    console.error('Erro ao cadastrar produto:', err);
    alert('Erro ao cadastrar produto. Tente novamente.');
  }
});
