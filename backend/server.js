
const express = require('express');

const app = express();
const PORT = 3000;

// Permite receber dados em formato JSON
app.use(express.json());

// Rota inicial da API
app.get('/', (req, res) => {
    res.json({
        mensagem: 'API do Conexão Escolar funcionando!'
    });
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
