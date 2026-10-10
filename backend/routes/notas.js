
const express = require('express');
const router = express.Router();
const pool = require('../config/db');

/**
 * @swagger
 * tags:
 *   name: Notas
 *   description: Gerenciamento das notas dos alunos
 */

/**
 * @swagger
 * /api/notas:
 *   get:
 *     summary: Listar notas com média e resultado final
 *     tags: [Notas]
 *     responses:
 *       200:
 *         description: Lista de notas
 *       500:
 *         description: Erro ao buscar notas
 */
router.get('/', async (req, res) => {
    try {
        const resultado = await pool.query(`
            SELECT *,
                ROUND((
                    n1 + n2 + n3 + n4 + n5 +
                    n6 + n7 + n8 + n9 + n10
                ) / 10, 2) AS media,
                CASE
                    WHEN (
                        n1 + n2 + n3 + n4 + n5 +
                        n6 + n7 + n8 + n9 + n10
                    ) / 10 >= 6 THEN 'Aprovado'
                    ELSE 'Reprovado'
                END AS resultado
            FROM notas
            ORDER BY aluno_id, disciplina
        `);

        res.json(resultado.rows);
    } catch (erro) {
        console.error('Erro ao listar notas:', erro.message);
        res.status(500).json({
            mensagem: 'Erro ao buscar notas.'
        });
    }
});

/**
 * @swagger
 * /api/notas:
 *   post:
 *     summary: Cadastrar notas de um aluno
 *     tags: [Notas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - aluno_id
 *               - disciplina
 *               - ano_letivo
 *               - n1
 *               - n2
 *               - n3
 *               - n4
 *               - n5
 *               - n6
 *               - n7
 *               - n8
 *               - n9
 *               - n10
 *             properties:
 *               aluno_id:
 *                 type: integer
 *                 example: 2
 *               disciplina:
 *                 type: string
 *                 example: Matemática
 *               ano_letivo:
 *                 type: integer
 *                 example: 2026
 *               n1:
 *                 type: number
 *                 example: 7
 *               n2:
 *                 type: number
 *                 example: 8
 *               n3:
 *                 type: number
 *                 example: 6
 *               n4:
 *                 type: number
 *                 example: 7
 *               n5:
 *                 type: number
 *                 example: 8
 *               n6:
 *                 type: number
 *                 example: 6
 *               n7:
 *                 type: number
 *                 example: 7
 *               n8:
 *                 type: number
 *                 example: 8
 *               n9:
 *                 type: number
 *                 example: 6
 *               n10:
 *                 type: number
 *                 example: 7
 *     responses:
 *       201:
 *         description: Notas cadastradas
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Aluno não encontrado
 *       409:
 *         description: Notas já cadastradas para esse aluno, disciplina e ano
 */
router.post('/', async (req, res) => {
    try {
        const {
            aluno_id,
            disciplina,
            ano_letivo,
            n1, n2, n3, n4, n5,
            n6, n7, n8, n9, n10
        } = req.body;

        const notas = [n1, n2, n3, n4, n5, n6, n7, n8, n9, n10];

        if (
            !aluno_id ||
            typeof disciplina !== 'string' ||
            !disciplina.trim() ||
            !ano_letivo ||
            notas.some(nota => nota === undefined || nota === null || nota === '')
        ) {
            return res.status(400).json({
                mensagem: 'Informe o aluno, a disciplina, o ano letivo e as 10 notas.'
            });
        }

        const valores = notas.map(Number);

        if (
            !Number.isInteger(Number(aluno_id)) ||
            Number(aluno_id) < 1 ||
            !Number.isInteger(Number(ano_letivo)) ||
            Number(ano_letivo) < 1 ||
            valores.some(nota => !Number.isFinite(nota) || nota < 0 || nota > 10)
        ) {
            return res.status(400).json({
                mensagem: 'O ID e o ano devem ser válidos, e cada nota deve estar entre 0 e 10.'
            });
        }

        const media = valores.reduce((soma, nota) => soma + nota, 0) / 10;

        const resultado = await pool.query(
            `INSERT INTO notas (
                aluno_id, disciplina, ano_letivo,
                n1, n2, n3, n4, n5,
                n6, n7, n8, n9, n10
            )
            VALUES (
                $1, $2, $3, $4, $5, $6, $7,
                $8, $9, $10, $11, $12, $13
            )
            RETURNING *`,
            [
                Number(aluno_id),
                disciplina.trim(),
                Number(ano_letivo),
                ...valores
            ]
        );

        res.status(201).json({
            mensagem: 'Notas cadastradas com sucesso!',
            notas: resultado.rows[0],
            media: Number(media.toFixed(2)),
            resultado: media >= 6 ? 'Aprovado' : 'Reprovado'
        });
    } catch (erro) {
        console.error('Erro ao cadastrar notas:', erro.message);

        if (erro.code === '23503') {
            return res.status(404).json({
                mensagem: 'O aluno informado não existe.'
            });
        }

        if (erro.code === '23505') {
            return res.status(409).json({
                mensagem: 'Já existem notas para esse aluno, disciplina e ano letivo.'
            });
        }

        res.status(500).json({
            mensagem: 'Erro ao cadastrar notas.'
        });
    }
});

/**
 * @swagger
 * /api/notas/{id}:
 *   get:
 *     summary: Consultar notas por ID
 *     tags: [Notas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Notas encontradas
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Registro não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^\d+$/.test(id) || Number(id) < 1) {
            return res.status(400).json({
                mensagem: 'Informe um ID válido.'
            });
        }

        const resultado = await pool.query(`
            SELECT *,
                ROUND((
                    n1 + n2 + n3 + n4 + n5 +
                    n6 + n7 + n8 + n9 + n10
                ) / 10, 2) AS media,
                CASE
                    WHEN (
                        n1 + n2 + n3 + n4 + n5 +
                        n6 + n7 + n8 + n9 + n10
                    ) / 10 >= 6 THEN 'Aprovado'
                    ELSE 'Reprovado'
                END AS resultado
            FROM notas
            WHERE id = $1
        `, [id]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                mensagem: 'Registro de notas não encontrado.'
            });
        }

        res.json(resultado.rows[0]);
    } catch (erro) {
        console.error('Erro ao consultar notas:', erro.message);
        res.status(500).json({
            mensagem: 'Erro ao buscar notas.'
        });
    }
});

/**
 * @swagger
 * /api/notas/{id}:
 *   put:
 *     summary: Atualizar as 10 notas de um registro
 *     tags: [Notas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - n1
 *               - n2
 *               - n3
 *               - n4
 *               - n5
 *               - n6
 *               - n7
 *               - n8
 *               - n9
 *               - n10
 *             properties:
 *               n1:
 *                 type: number
 *                 example: 8
 *               n2:
 *                 type: number
 *                 example: 8
 *               n3:
 *                 type: number
 *                 example: 8
 *               n4:
 *                 type: number
 *                 example: 8
 *               n5:
 *                 type: number
 *                 example: 8
 *               n6:
 *                 type: number
 *                 example: 8
 *               n7:
 *                 type: number
 *                 example: 8
 *               n8:
 *                 type: number
 *                 example: 8
 *               n9:
 *                 type: number
 *                 example: 8
 *               n10:
 *                 type: number
 *                 example: 8
 *     responses:
 *       200:
 *         description: Notas atualizadas
 *       400:
 *         description: ID ou notas inválidas
 *       404:
 *         description: Registro não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {
            n1, n2, n3, n4, n5,
            n6, n7, n8, n9, n10
        } = req.body || {};

        if (!/^\d+$/.test(id) || Number(id) < 1) {
            return res.status(400).json({
                mensagem: 'Informe um ID válido.'
            });
        }

        const notas = [n1, n2, n3, n4, n5, n6, n7, n8, n9, n10];

        if (notas.some(nota => nota === undefined || nota === null || nota === '')) {
            return res.status(400).json({
                mensagem: 'Informe as 10 notas.'
            });
        }

        const valores = notas.map(Number);

        if (valores.some(nota => !Number.isFinite(nota) || nota < 0 || nota > 10)) {
            return res.status(400).json({
                mensagem: 'Cada nota deve estar entre 0 e 10.'
            });
        }

        const atualizacao = await pool.query(`
            UPDATE notas
            SET n1 = $1, n2 = $2, n3 = $3, n4 = $4, n5 = $5,
                n6 = $6, n7 = $7, n8 = $8, n9 = $9, n10 = $10
            WHERE id = $11
            RETURNING *
        `, [...valores, Number(id)]);

        if (atualizacao.rows.length === 0) {
            return res.status(404).json({
                mensagem: 'Registro de notas não encontrado.'
            });
        }

        const media = valores.reduce((soma, nota) => soma + nota, 0) / 10;

        res.json({
            mensagem: 'Notas atualizadas com sucesso!',
            notas: atualizacao.rows[0],
            media: Number(media.toFixed(2)),
            resultado: media >= 6 ? 'Aprovado' : 'Reprovado'
        });
    } catch (erro) {
        console.error('Erro ao atualizar notas:', erro);
        res.status(500).json({
            mensagem: 'Erro ao atualizar notas.'
        });
    }
});

/**
 * @swagger
 * /api/notas/{id}:
 *   delete:
 *     summary: Excluir um registro de notas
 *     tags: [Notas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Registro excluído
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Registro não encontrado
 *       500:
 *         description: Erro interno do servidor
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
            'DELETE FROM notas WHERE id = $1 RETURNING *',
            [id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                mensagem: 'Registro de notas não encontrado.'
            });
        }

        res.json({
            mensagem: 'Registro de notas excluído com sucesso!'
        });
    } catch (erro) {
        console.error('Erro ao excluir notas:', erro.message);
        res.status(500).json({
            mensagem: 'Erro ao excluir notas.'
        });
    }
});

module.exports = router;
