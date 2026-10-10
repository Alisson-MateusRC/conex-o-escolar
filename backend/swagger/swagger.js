
const path = require('path');
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
    apis: [
        path.resolve(__dirname, '../routes/alunos.js'),
        path.resolve(__dirname, '../routes/notas.js')
    ]
};

const swaggerSpec = swaggerJsdoc(opcoes, {
    failOnErrors: true
});

console.log('Arquivos do Swagger:', opcoes.apis);
console.log(
    'Rotas encontradas:',
    Object.keys(swaggerSpec.paths || {})
);

module.exports = swaggerSpec;
