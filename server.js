const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;


mongoose.connect('mongodb://localhost/lanchonete')

  .then(() => {
    console.log('MongoDB conectado');
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  })
  .catch(err => {

    console.error('Erro ao conectar ao MongoDB!', err);
    process.exit(1);
  });


const UserSchema = new mongoose.Schema({ 

  username: { type: String, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false }
});


const Produto = mongoose.model('Produto', new mongoose.Schema({ 
  nome: String, 
  preco: Number, 
  quantidade: Number, 
  tipo: String 
}));

const User = mongoose.model('User', UserSchema);

app.use(cors()); 
app.use(express.json()); 
app.use(express.static(path.join(__dirname, 'public')));


app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.json({ success: false, message: 'Usuário já existe!' });
    }

    const newUser = new User({ username, password });
    await newUser.save();

    res.json({ success: true, message: 'Cadastro realizado com sucesso!' });
  } catch (err) {
    res.json({ success: false, message: 'Erro ao cadastrar usuário!', error: err });
  }
});


app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.json({ success: false, message: 'Usuário não encontrado!' });
    }

    if (user.password === password) {
      res.json({ success: true, isAdmin: user.isAdmin });
    } else {
      res.json({ success: false, message: 'Senha incorreta!' });
    }
  } catch (err) {
    res.json({ success: false, message: 'Erro!', error: err });
  }
});



app.post('/produtos', async (req, res) => {
  const { nome, preco, quantidade, tipo } = req.body;

  if (!nome || !preco || !quantidade || !tipo) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
  }

  try {
    const novoProduto = new Produto({ nome, preco, quantidade, tipo });
    await novoProduto.save();
    res.status(201).json({ message: 'Produto criado com sucesso' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao salvar o produto!', error: err });
  }
});

app.get('/produtos', async (req, res) => {
  try {
    const produtos = await Produto.find({});
    res.json(produtos);
  } catch (err) {
    res.status(500).json({ message: 'Erro!', error: err });
  }
});


app.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Erro!', error: err });
  }
});


app.delete('/deleteUser/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Usuário excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro!', error });
  }
});


app.put('/editUser/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado!' });

    if (req.body.password) user.password = req.body.password;
    if (req.body.isAdmin !== undefined) user.isAdmin = req.body.isAdmin;

    await user.save();

    res.json({ success: true, message: 'Usuário atualizado com sucesso!' });
  } catch (err) {
    res.status(500).json({ message: 'Erro!', error: err });
  }
});


app.get('/cadastro', (req, res) => res.sendFile(path.join(__dirname, 'public', 'cadastro.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/usuarios', (req, res) => res.sendFile(path.join(__dirname, 'public', 'usuarios.html')));
app.get('/estoque', (req, res) => res.sendFile(path.join(__dirname, 'public', 'estoque.html')));
app.get('/login/cliente', (req, res) => res.sendFile(path.join(__dirname, 'public', 'cliente.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));
app.get('/teste', (req, res) => res.send('Servidor rodando!'));
