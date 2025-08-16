// server.js
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Permite receber JSON no corpo da requisição
app.use(express.json());
app.use(cors()); // habilita CORS para qualquer origem

app.post('/', (req, res) => {
  posturaData = req.body; // atualiza os dados
  console.log('Recebi JSON:');
  console.log(req.body);
  res.send('JSON recebido com sucesso!');
});
let posturaData = { cervical: 045, toracica: 6534, lombar: 13453 };
// Rota para visualizar os dados no navegador
app.get('/', (req, res) => {
  res.json(posturaData);
});
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
