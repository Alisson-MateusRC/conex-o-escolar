
const swaggerJsdoc = require('swagger-jsdoc');

const opcoes = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Conexão Escolar',
            version: '1.0.0',
            description: 'Documentação da API do sistema Conexão Escolar.'
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor local'
            }
        ]
    },
    apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsdoc(opcoes);

module.exports = swaggerSpec;
