
require('dotenv').config();

const pool = require('./config/db');

async function testarConexao() {
    try {
        const resultado = await pool.query('SELECT NOW()');

        console.log('Conexão com o banco realizada com sucesso!');
        console.log('Horário retornado pelo PostgreSQL:', resultado.rows[0].now);
    } catch (erro) {
        console.error('Não foi possível conectar ao banco:', erro.message);
    } finally {
        await pool.end();
    }
}

testarConexao();
