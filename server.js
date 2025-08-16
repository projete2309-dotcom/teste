// server.js
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Permite receber JSON no corpo da requisição
app.use(express.json());

// JSON fixo dentro do código
let posturaData = { cervical: 0, toracica: 0, lombar: 0 };

app.post('/postura', (req, res) => {
  posturaData = req.body; // atualiza os dados
  console.log('Recebi JSON:');
  console.log(req.body);
  res.send('JSON recebido com sucesso!');
});


// Rota para visualizar os dados no navegador
app.get('/', (req, res) => {
  res.json(posturaData);
});
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
