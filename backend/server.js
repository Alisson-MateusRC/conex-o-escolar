
const express = require('express');

const app = express();
const PORT = 3000;

// Permite receber dados em formato JSON
app.use(express.json());

// Importa as rotas de alunos
const alunosRoutes = require('./routes/alunos');

// Rota inicial da API
app.get('/', (req, res) => {
    res.json({
        mensagem: 'API do Conexão Escolar funcionando!'
    });
});

// Registra as rotas de alunos
app.use('/api/alunos', alunosRoutes);

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
