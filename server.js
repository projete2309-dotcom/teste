// server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const request = require('supertest'); // usado nos testes

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

  res.status(200).json({ message: 'JSON recebido e salvo com sucesso!' });
});

// ⏰ A cada 1 minuto salva o último registro novamente (se existir)
setInterval(() => {
  if (ultimoRegistro) {
    const registroAtualizado = { ...ultimoRegistro, timestamp: Date.now() };
    posturaData.push(registroAtualizado);
    salvarCSV(registroAtualizado);
  }
}, 60 * 1000);

// Rota GET para visualizar todos os dados
app.get('/', (req, res) => {
  res.json(posturaData);
});

// Rota GET para baixar o CSV
app.get('/csv', (req, res) => {
  res.download(csvFilePath);
});

// =============================
// TESTES AUTOMÁTICOS
// =============================
async function rodarTestes() {
  console.log("\n🔍 Rodando testes automáticos...");

  // Teste 1: GET inicial (array)
  let res = await request(app).get('/');
  if (Array.isArray(res.body)) {
    console.log("✅ Teste 1 passou (GET inicial retorna array)");
  } else {
    console.error("❌ Teste 1 falhou");
  }

  // Teste 2: POST envia dados
  const novoDado = {
    cervical: 10,
    toracica: 20,
    lombar: 30,
    cervicalmax: 50,
    cervicalmin: 5,
    toraxmax: 60,
    toraxmin: 10,
    lombarmax: 70,
    lombarmin: 20
  };

  res = await request(app).post('/').send(novoDado).set('Content-Type', 'application/json');
  if (res.body.message === 'JSON recebido e salvo com sucesso!') {
    console.log("✅ Teste 2 passou (POST salva dados)");
  } else {
    console.error("❌ Teste 2 falhou");
  }

  // Teste 3: GET retorna os dados salvos
  res = await request(app).get('/');
  if (res.body.length > 0 && res.body[0].cervical !== undefined) {
    console.log("✅ Teste 3 passou (GET retorna dados salvos)");
  } else {
    console.error("❌ Teste 3 falhou");
  }

  // Teste 4: Verifica se CSV existe e tem conteúdo
  if (fs.existsSync(csvFilePath) && fs.readFileSync(csvFilePath, "utf8").split("\n").length > 1) {
    console.log("✅ Teste 4 passou (CSV foi criado e preenchido)");
  } else {
    console.error("❌ Teste 4 falhou");
  }

  console.log("🎯 Testes finalizados\n");
}

// =============================
// EXECUÇÃO
// =============================
if (process.argv[2] === "test") {
  rodarTestes().then(() => process.exit(0));
} else {
  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });
}

module.exports = app;
