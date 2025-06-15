document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Cadastro realizado com sucesso!');
        } else {
            alert('Erro: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Erro ao fazer o cadastro:', error);
        alert('Houve um erro ao tentar cadastrar. Tente novamente.');
    });
});

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("product-form");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const preco = parseFloat(document.getElementById("preco").value);
    const quantidade = parseInt(document.getElementById("quantidade").value);
    const tipo = document.getElementById("tipo").value;

    fetch("http://localhost:3000/produtos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ nome, preco, quantidade, tipo })
    })
      .then(response => {
        if (!response.ok) throw new Error("Erro ao cadastrar produto");
        return response.text();
      })
      .then(() => {
        alert("Produto cadastrado com sucesso!");
        form.reset();
      })
      .catch(error => {
        console.error("Erro:", error);
        alert("Erro ao cadastrar produto!");
      });
  });
});
