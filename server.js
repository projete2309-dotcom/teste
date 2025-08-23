// server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Caminho do CSV
const csvFilePath = path.join(__dirname, 'postura.csv');

// Se o CSV ainda não existir, cria com cabeçalho
if (!fs.existsSync(csvFilePath)) {
  fs.writeFileSync(csvFilePath, "timestamp,cervical,toracica,lombar,cervicalmax,cervicalmin,toraxmax,toraxmin,lombarmax,lombarmin\n");
}

// Histórico em memória
let posturaData = [];
let ultimoRegistro = null;

// Função para salvar no CSV
function salvarCSV(dado) {
  const linha = `${dado.timestamp},${dado.cervical},${dado.toracica},${dado.lombar},${dado.cervicalmax},${dado.cervicalmin},${dado.toraxmax},${dado.toraxmin},${dado.lombarmax},${dado.lombarmin}\n`;
  fs.appendFileSync(csvFilePath, linha);
}

// Rota POST para atualizar os dados
app.post('/', (req, res) => {
  ultimoRegistro = {
    timestamp: Date.now(),
    cervical: req.body.cervical,
    toracica: req.body.toracica,
    lombar: req.body.lombar,
    cervicalmax: req.body.cervicalmax,
    cervicalmin: req.body.cervicalmin,
    toraxmax: req.body.toraxmax,
    toraxmin: req.body.toraxmin,
    lombarmax: req.body.lombarmax,
    lombarmin: req.body.lombarmin
  };

  posturaData.push(ultimoRegistro);
  salvarCSV(ultimoRegistro);

  console.log('Recebi JSON:', ultimoRegistro);
  res.send('JSON recebido e salvo com sucesso!');
});

// ⏰ A cada 1 minuto salva o último registro novamente (se existir)
setInterval(() => {
  if (ultimoRegistro) {
    const registroAtualizado = { ...ultimoRegistro, timestamp: Date.now() };
    posturaData.push(registroAtualizado);
    salvarCSV(registroAtualizado);
    console.log('Registro salvo automaticamente:', registroAtualizado);
  }
}, 60 * 1000); // 1 minuto

// Rota GET para visualizar todos os dados
app.get('/', (req, res) => {
  res.json(posturaData);
});

// Rota GET para baixar o CSV
app.get('/csv', (req, res) => {
  res.download(csvFilePath);
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
