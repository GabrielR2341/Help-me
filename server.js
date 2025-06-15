const express = require('express');
const mongoose = require('mongoose');
//const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 3000;

mongoose.connect('mongodb://localhost/lanchonete', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB conectado');
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.log('Erro ao conectar ao MongoDB: ', err);
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
app.use(express.static('public'));


app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.json({ success: false, message: 'Usuário já existe!' });
    }

    const newUser = new User({ username, password });

    try {
        await newUser.save();
        res.json({ success: true, message: 'Cadastro realizado com sucesso!' });
    } catch (err) {
        res.json({ success: false, message: 'Erro ao cadastrar usuário: ' + err });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
        return res.json({ success: false, message: 'Usuário não encontrado!' });
    }

    if (user.password === password) {
        return res.json({ success: true, isAdmin: user.isAdmin });
    } else {
        return res.json({ success: false, message: 'Senha incorreta!' });
    }
});

app.post('/produtos', async (req, res) => {
  const { nome, preco, quantidade, tipo } = req.body;

  if (!nome || !preco || !quantidade || !tipo) {
    return res.status(400).send('Todos os campos são obrigatórios');
  }

  const novoProduto = new Produto({ nome, preco, quantidade, tipo });

  try {
    await novoProduto.save();
    res.status(201).send('Produto criado com sucesso');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao salvar produto');
  }
});


app.get('/produtos', async (req, res) => {
  try {
    const produtos = await Produto.find();
    res.json(produtos);
  } catch (err) {
    res.status(500).send('Erro ao listar produtos');
    console.error(err);
  }
});

app.get('/users', async (req, res) => {
    try {
        const users = await User.find(); 
        res.json(users);
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erro ao carregar os usuários' });
    }
});

app.get('/cadastro', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cadastro.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/usuarios', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'usuarios.html'));
});

app.get('/estoque', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'estoque.html'));
});

app.get('/teste', (req, res) => {
  res.send('Servidor rodando!');
});

app.delete('/deleteUser/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        await User.findByIdAndDelete(userId);
        res.json({ success: true, message: 'Usuário excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        res.status(500).json({ success: false, message: 'Erro ao excluir usuário' });
    }
});

app.put('/editUser/:id', async (req, res) => {
    const userId = req.params.id;
    const { password, isAdmin } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuário não encontrado!' });
        }

        if (password) {
            user.password = password;
        }
        user.isAdmin = isAdmin;

        await user.save();

        res.json({ success: true, message: 'Usuário atualizado com sucesso!' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erro ao atualizar o usuário: ' + err });
    }
});