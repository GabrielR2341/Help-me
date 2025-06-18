const mongoose = require('mongoose');

const ProdutoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  preco: { type: Number, required: true },
  descricao: { type: String },
  quantidade: { type: Number, required: true },
  tipo: { type: String, required: true }
});

module.exports = mongoose.model('Produto', ProdutoSchema);
