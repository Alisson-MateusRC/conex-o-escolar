
require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

// Verifica a conexão com o banco de dados
pool.on('connect', () => {
    console.log('Conexão com o PostgreSQL estabelecida!');
});

pool.on('error', (err) => {
    console.error('Erro inesperado no PostgreSQL:', err.message);
});

module.exports = pool;
