
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swagger');

const app = express();
const PORT = 3000;

app.use(express.json());

// Rota principal
app.get('/', (req, res) => {
    res.json({
        mensagem: 'API do Conexão Escolar funcionando!'
    });
});

// Documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas dos alunos
const alunosRoutes = require('./routes/alunos');
app.use('/api/alunos', alunosRoutes);

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Documentação Swagger: http://localhost:${PORT}/api-docs`);
});
