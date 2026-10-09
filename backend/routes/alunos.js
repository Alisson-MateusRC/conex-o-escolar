
const express = require('express');

const router = express.Router();

// Lista temporária de alunos
const alunos = [];

// Rota para listar todos os alunos
router.get('/', (req, res) => {
    res.json(alunos);
});

// Rota para cadastrar um aluno
router.post('/', (req, res) => {
    const { nome, email, turma } = req.body;

    if (!nome || !email || !turma) {
        return res.status(400).json({
            mensagem: 'Informe nome, email e turma do aluno.'
        });
    }

    const novoAluno = {
        id: alunos.length + 1,
        nome,
        email,
        turma
    };

    alunos.push(novoAluno);

    res.status(201).json({
        mensagem: 'Aluno cadastrado com sucesso!',
        aluno: novoAluno
    });
});

module.exports = router;
