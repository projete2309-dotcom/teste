// server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const csvFilePath = path.join(__dirname, 'postura.csv');

if (!fs.existsSync(csvFilePath)) {
  fs.writeFileSync(csvFilePath, "timestamp,cervical,toracica,lombar,cervicalmax,cervicalmin,toraxmax,toraxmin,lombarmax,lombarmin\n");
}

let posturaData = [];
let ultimoRegistro = null;

function salvarCSV(dado) {
  const linha = `${dado.timestamp},${dado.cervical},${dado.toracica},${dado.lombar},${dado.cervicalmax},${dado.cervicalmin},${dado.toraxmax},${dado.toraxmin},${dado.lombarmax},${dado.lombarmin}\n`;
  fs.appendFileSync(csvFilePath, linha);
}

app.post('/', (req, res) => {
  ultimoRegistro = { timestamp: Date.now(), ...req.body };
  posturaData.push(ultimoRegistro);
  salvarCSV(ultimoRegistro);
  res.status(200).json({ message: 'JSON recebido e salvo com sucesso!' });
});

setInterval(() => {
  if (ultimoRegistro) {
    const registroAtualizado = { ...ultimoRegistro, timestamp: Date.now() };
    posturaData.push(registroAtualizado);
    salvarCSV(registroAtualizado);
  }
}, 60 * 1000);

app.get('/', (req, res) => {
  res.json(posturaData);
});

app.get('/csv', (req, res) => {
  res.download(csvFilePath);
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
