
const { body, validationResult } = require('express-validator');

// Regras para validar os dados do aluno
const validarAluno = [
    body('nome')
        .trim()
        .notEmpty()
        .withMessage('O nome do aluno é obrigatório.')
        .isLength({ max: 100 })
        .withMessage('O nome deve ter no máximo 100 caracteres.'),

    body('email')
        .trim()
        .notEmpty()
        .withMessage('O email do aluno é obrigatório.')
        .isEmail()
        .withMessage('Informe um email válido.')
        .isLength({ max: 150 })
        .withMessage('O email deve ter no máximo 150 caracteres.'),

    body('turma')
        .trim()
        .notEmpty()
        .withMessage('A turma do aluno é obrigatória.')
        .isLength({ max: 50 })
        .withMessage('A turma deve ter no máximo 50 caracteres.')
];

// Verifica se houve erros de validação
function verificarValidacoes(req, res, next) {
    const erros = validationResult(req);

    if (!erros.isEmpty()) {
        return res.status(400).json({
            mensagem: 'Dados inválidos.',
            erros: erros.array().map(erro => ({
                campo: erro.path,
                mensagem: erro.msg
            }))
        });
    }

    next();
}

module.exports = {
    validarAluno,
    verificarValidacoes
};
