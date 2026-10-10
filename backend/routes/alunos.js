
const express = require('express');
const router = express.Router();
const pool = require('../config/db');

const {
    validarAluno,
    verificarValidacoes
} = require('../validators/alunoValidator');

/**
 * @swagger
 * tags:
 *   name: Alunos
 *   description: Gerenciamento de alunos do Conexão Escolar
 */

/**
 * @swagger
 * /api/alunos:
 *   get:
 *     summary: Listar todos os alunos
 *     tags: [Alunos]
 *     responses:
 *       200:
 *         description: Lista de alunos retornada com sucesso.
 *       500:
 *         description: Erro ao buscar alunos.
 */
router.get('/', async (req, res) => {
    try {
        const resultado = await pool.query(
            'SELECT * FROM alunos ORDER BY id'
        );
        res.json(resultado.rows);
    } catch (erro) {
        console.error('Erro ao listar alunos:', erro.message);
        res.status(500).json({
            mensagem: 'Erro ao buscar alunos no banco de dados.'
        });
    }
});

/**
 * @swagger
 * /api/alunos/{id}:
 *   get:
 *     summary: Consultar um aluno pelo ID
 *     tags: [Alunos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identificador do aluno
 *     responses:
 *       200:
 *         description: Aluno encontrado.
 *       400:
 *         description: ID inválido.
 *       404:
 *         description: Aluno não encontrado.
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^\d+$/.test(id) || Number(id) < 1) {
            return res.status(400).json({
                mensagem: 'Informe um ID válido.'
            });
        }

        const resultado = await pool.query(
            'SELECT * FROM alunos WHERE id = $1',
            [id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                mensagem: 'Aluno não encontrado.'
            });
        }

        res.json(resultado.rows[0]);
    } catch (erro) {
        console.error('Erro ao consultar aluno:', erro.message);
        res.status(500).json({
            mensagem: 'Erro ao buscar aluno no banco de dados.'
        });
    }
});

/**
 * @swagger
 * /api/alunos:
 *   post:
 *     summary: Cadastrar um novo aluno
 *     tags: [Alunos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - turma
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Maria Silva
 *               email:
 *                 type: string
 *                 example: maria.silva@teste.com
 *               turma:
 *                 type: string
 *                 example: 1A
 *     responses:
 *       201:
 *         description: Aluno cadastrado com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       409:
 *         description: Email já cadastrado.
 */
router.post('/', validarAluno, verificarValidacoes, async (req, res) => {
    try {
        const { nome, email, turma } = req.body;

        const resultado = await pool.query(
            `INSERT INTO alunos (nome, email, turma)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [nome, email, turma]
        );

        res.status(201).json({
            mensagem: 'Aluno cadastrado com sucesso!',
            aluno: resultado.rows[0]
        });
    } catch (erro) {
        console.error('Erro ao cadastrar aluno:', erro.message);

        if (erro.code === '23505') {
            return res.status(409).json({
                mensagem: 'Este email já está cadastrado.'
            });
        }

        res.status(500).json({
            mensagem: 'Erro ao cadastrar aluno no banco de dados.'
        });
    }
});

/**
 * @swagger
 * /api/alunos/{id}:
 *   put:
 *     summary: Atualizar os dados de um aluno
 *     tags: [Alunos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identificador do aluno
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - turma
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Maria Silva
 *               email:
 *                 type: string
 *                 example: maria.silva@teste.com
 *               turma:
 *                 type: string
 *                 example: 2A
 *     responses:
 *       200:
 *         description: Aluno atualizado com sucesso.
 *       400:
 *         description: ID ou dados inválidos.
 *       404:
 *         description: Aluno não encontrado.
 *       409:
 *         description: Email já utilizado por outro aluno.
 */
router.put('/:id', validarAluno, verificarValidacoes, async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, email, turma } = req.body;

        if (!/^\d+$/.test(id) || Number(id) < 1) {
            return res.status(400).json({
                mensagem: 'Informe um ID válido.'
            });
        }

        const resultado = await pool.query(
            `UPDATE alunos
             SET nome = $1, email = $2, turma = $3
             WHERE id = $4
             RETURNING *`,
            [nome, email, turma, id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                mensagem: 'Aluno não encontrado.'
            });
        }

        res.json({
            mensagem: 'Aluno atualizado com sucesso!',
            aluno: resultado.rows[0]
        });
    } catch (erro) {
        console.error('Erro ao atualizar aluno:', erro.message);

        if (erro.code === '23505') {
            return res.status(409).json({
                mensagem: 'Este email já está cadastrado para outro aluno.'
            });
        }

        res.status(500).json({
            mensagem: 'Erro ao atualizar aluno no banco de dados.'
        });
    }
});

/**
 * @swagger
 * /api/alunos/{id}:
 *   delete:
 *     summary: Excluir um aluno pelo ID
 *     tags: [Alunos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identificador do aluno
 *     responses:
 *       200:
 *         description: Aluno excluído com sucesso.
 *       400:
 *         description: ID inválido.
 *       404:
 *         description: Aluno não encontrado.
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^\d+$/.test(id) || Number(id) < 1) {
            return res.status(400).json({
                mensagem: 'Informe um ID válido.'
            });
        }

        const resultado = await pool.query(
            'DELETE FROM alunos WHERE id = $1 RETURNING *',
            [id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                mensagem: 'Aluno não encontrado.'
            });
        }

        res.json({
            mensagem: 'Aluno excluído com sucesso!',
            aluno: resultado.rows[0]
        });
    } catch (erro) {
        console.error('Erro ao excluir aluno:', erro.message);
        res.status(500).json({
            mensagem: 'Erro ao excluir aluno do banco de dados.'
        });
    }
});

module.exports = router;
