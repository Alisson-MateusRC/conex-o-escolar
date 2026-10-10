
const pool = require('./config/db');

async function criarTabelaNotas() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS notas (
                id SERIAL PRIMARY KEY,
                aluno_id INTEGER NOT NULL
                    REFERENCES alunos(id) ON DELETE CASCADE,
                disciplina VARCHAR(100) NOT NULL,
                ano_letivo INTEGER NOT NULL,
                n1 NUMERIC(4,2) NOT NULL CHECK (n1 BETWEEN 0 AND 10),
                n2 NUMERIC(4,2) NOT NULL CHECK (n2 BETWEEN 0 AND 10),
                n3 NUMERIC(4,2) NOT NULL CHECK (n3 BETWEEN 0 AND 10),
                n4 NUMERIC(4,2) NOT NULL CHECK (n4 BETWEEN 0 AND 10),
                n5 NUMERIC(4,2) NOT NULL CHECK (n5 BETWEEN 0 AND 10),
                n6 NUMERIC(4,2) NOT NULL CHECK (n6 BETWEEN 0 AND 10),
                n7 NUMERIC(4,2) NOT NULL CHECK (n7 BETWEEN 0 AND 10),
                n8 NUMERIC(4,2) NOT NULL CHECK (n8 BETWEEN 0 AND 10),
                n9 NUMERIC(4,2) NOT NULL CHECK (n9 BETWEEN 0 AND 10),
                n10 NUMERIC(4,2) NOT NULL CHECK (n10 BETWEEN 0 AND 10),
                criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE (aluno_id, disciplina, ano_letivo)
            );
        `);

        console.log('Tabela de notas criada ou já existente!');
    } catch (erro) {
        console.error('Erro ao criar tabela de notas:', erro.message);
    } finally {
        await pool.end();
    }
}

criarTabelaNotas();
