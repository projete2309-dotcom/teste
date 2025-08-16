// server.js
const express = require('express');
const cors = require('cors'); 
const app = express();
const port = process.env.PORT || 3000;

// Permite receber JSON no corpo da requisição
app.use(express.json());
app.use(cors()); // habilita CORS para qualquer origem

// JSON fixo dentro do código
let posturaData = { cervical: 232, toracica: 434, lombar: 340 };

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
;

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
