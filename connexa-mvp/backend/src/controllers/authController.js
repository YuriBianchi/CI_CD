const authService = require("../services/authService");

async function login(req, res) {
  try {
    const { email, senha } = req.body || {};
    if (!email || !senha) {
      return res.status(400).json({ error: "email e senha são obrigatórios" });
    }
    const token = await authService.authenticate(email, senha);
    if (!token) return res.status(401).json({ error: "Credenciais inválidas" });
    return res.json({ token });
  } catch (err) {
    console.error("authController.login error", err);
    return res.status(500).json({ error: "Erro interno" });
  }
}

module.exports = { login };
