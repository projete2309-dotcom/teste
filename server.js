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
let posturaData = {"cervical":5002300,"toracica":810012900,"lombar":3102003,"cervicalmax":50.66465,"cervicalmin":10.4649646,"toraxmax":50.34664656,"toraxmin":10.6464655,"lombarmax":70,"lombarmin":30,"sentado":true};


// Rota POST para atualizar os dados
app.post('/', (req, res) => {
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
