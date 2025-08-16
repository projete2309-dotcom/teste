// server.js
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Habilita CORS
app.use(cors());

// Permite receber JSON no corpo da requisição
app.use(express.json());

// JSON inicial
let posturaData = { cervical: 232, toracica: 434, lombar: 340 };

// Rota POST para atualizar os dados
app.post('/postura', (req, res) => {
  posturaData = req.body;
  console.log('Recebi JSON:', req.body);
  res.send('JSON recebido com sucesso!');
});

// Rota GET para visualizar os dados
app.get('/', (req, res) => {
  res.json(posturaData);
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
