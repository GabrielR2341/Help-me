const express = require('express');
const router = express.Router();
const Produto = require('../models/produto'); // Importando o model

// GET /produtos - Lista todos os produtos
router.get('/', async (req, res) => {
  try {
    const produtos = await Produto.find().sort({ nome: 1 });
    res.json(produtos);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar produtos', error: err.message });
  }
});

// POST /produtos - Cadastra novo produto
router.post('/', async (req, res) => {
  const { nome, preco, descricao, quantidade, tipo } = req.body;

  if (!nome || preco == null || quantidade == null || !tipo) {
    return res.status(400).json({ message: 'Campos obrigatórios faltando.' });
  }

  try {
    const novoProduto = new Produto({ nome, preco, descricao, quantidade, tipo });
    await novoProduto.save();
    res.status(201).json({ message: 'Produto cadastrado com sucesso', produto: novoProduto });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao cadastrar produto', error: err.message });
  }
});

// DELETE /produtos/:id - Remove um produto
router.delete('/:id', async (req, res) => {
  try {
    const produto = await Produto.findByIdAndDelete(req.params.id);
    if (!produto) return res.status(404).json({ message: 'Produto não encontrado' });
    res.json({ message: 'Produto removido com sucesso' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao remover produto', error: err.message });
  }
});

module.exports = router;
