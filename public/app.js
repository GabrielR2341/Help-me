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

const express = require('express');
const mongoose = require('mongoose');
const app = express();

const MovimentacaoSchema = new mongoose.Schema({
  data: { type: Date, default: Date.now },
  nome: String,
  tipoMovimentacao: String, // 'entrada' ou 'saida'
  quantidade: Number,
  precoUnitario: Number,
  tipoProduto: String
});

const Movimentacao = mongoose.model('Movimentacao', MovimentacaoSchema);

app.get('/estoque', async (req, res) => {
  try {
    const movimentacoes = await Movimentacao.find().sort({ data: -1 });
    res.json(movimentacoes);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao carregar movimentações', error: err });
  }
});

app.delete('/produtos/:id', async (req, res) => {
  try {
    const produto = await Produto.findByIdAndDelete(req.params.id);
    if (!produto) return res.status(404).json({ message: 'Produto não encontrado' });
    res.json({ message: 'Produto removido com sucesso!' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao remover produto', error: err });
  }
});

app.post('/produtos', async (req, res) => {
  const { nome, preco, descricao, quantidade, tipo } = req.body;

  if (!nome || !preco || !descricao || !quantidade || !tipo) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
  }

  try {
    const novoProduto = new Produto({ nome, preco, descricao, quantidade, tipo });
    await novoProduto.save();
    res.status(201).json({ message: 'Produto criado com sucesso' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao salvar o produto!', error: err });
  }
});

const produtosRoutes = require('./routes/produtos'); // ou o caminho correto

app.use('/produtos', produtosRoutes);

// DELETE /produtos/:id
router.delete('/:id', async (req, res) => {
  try {
    await Produto.findByIdAndDelete(req.params.id);
    res.json({ message: 'Produto removido com sucesso' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao remover produto', error: err.message });
  }
});

// POST /produtos
router.post('/', async (req, res) => {
  try {
    const { nome, preco, quantidade, tipo } = req.body;

    if (!nome || preco == null || quantidade == null || !tipo) {
      return res.status(400).json({ message: 'Campos obrigatórios faltando.' });
    }

    const novoProduto = new Produto({ nome, preco, quantidade, tipo });
    await novoProduto.save();

    res.status(201).json(novoProduto);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao cadastrar produto.', error: error.message });
  }
});

const PedidoSchema = new mongoose.Schema({
  nomeCliente: String,
  produtoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Produto' },
  quantidade: Number,
  data: { type: Date, default: Date.now }
});

const Pedido = mongoose.model('Pedido', PedidoSchema);

app.post('/pedidos', async (req, res) => {
  const { nomeCliente, produtoId, quantidade } = req.body;

  if (!nomeCliente || !produtoId || !quantidade) {
    return res.status(400).json({ success: false, message: 'Dados incompletos.' });
  }

  try {
    const novoPedido = new Pedido({ nomeCliente, produtoId, quantidade });
    await novoPedido.save();
    res.status(201).json({ success: true, message: 'Pedido criado com sucesso.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erro ao salvar pedido.' });
  }
});
