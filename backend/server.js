const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swagger');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        mensagem: 'API do Conexão Escolar funcionando!'
    });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const alunosRoutes = require('./routes/alunos');
app.use('/api/alunos', alunosRoutes);

const notasRoutes = require('./routes/notas');
app.use('/api/notas', notasRoutes);

app.use((req, res) => {
    res.status(404).json({
        mensagem: 'Rota não encontrada.'
    });
});

app.listen(PORT, () => {
    console.log('Servidor rodando em http://localhost:' + PORT);
    console.log('Documentação Swagger: http://localhost:' + PORT + '/api-docs');
});