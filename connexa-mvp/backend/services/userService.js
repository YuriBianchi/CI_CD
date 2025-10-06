const db = require("../src/db");

async function verificarEmailDuplicado(email) {
  const sql = `SELECT id FROM Usuario WHERE email = ?`;
  const row = await db.get(sql, [email]);
  return !!row;
}

async function cadastrarUsuario({ email, senha }) {
  const sql = `INSERT INTO Usuario (email, senha) VALUES (?, ?)`;
  await db.run(sql, [email, senha]);
}

module.exports = { verificarEmailDuplicado, cadastrarUsuario };