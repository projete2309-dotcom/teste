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

  res.status(200).json({ message: 'JSON recebido e salvo com sucesso!' });
});

app.get('/', (req, res) => {
  res.json(posturaData);
});

app.get('/csv', (req, res) => {
  res.download(csvFilePath);
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });
}

module.exports = app; // 🔹 exporta para usar no teste
