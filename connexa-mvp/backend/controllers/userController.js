const userService = require("../services/userService");
const bcrypt = require("bcrypt");

const ALLOWED_DOMAIN = "@fatec.sp.gov.br";

async function cadastrarUsuario(req, res) {
  try {
    const { email, senha } = req.body;

    // Validação dos campos obrigatórios
    if (!email || !senha) {
      return res.status(400).json({ error: "Email e senha são obrigatórios." });
    }

    // Validação do domínio do email
    if (!email.endsWith(ALLOWED_DOMAIN)) {
      return res
        .status(400)
        .json({ error: `O email deve ser do domínio ${ALLOWED_DOMAIN}.` });
    }

    // Verificar se o email já está cadastrado
    const emailDuplicado = await userService.verificarEmailDuplicado(email);
    if (emailDuplicado) {
      return res.status(400).json({ error: "O email já está cadastrado." });
    }

    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Inserir usuário no banco de dados
    await userService.cadastrarUsuario({ email, senha: senhaHash });

    res.status(201).json({ message: "Usuário cadastrado com sucesso." });
  } catch (err) {
    console.error("Erro ao cadastrar usuário:", err);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
}

module.exports = { cadastrarUsuario };