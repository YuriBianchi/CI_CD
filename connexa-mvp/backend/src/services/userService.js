const { db } = require("../db");

function dbGet(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function dbRun(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

async function verificarEmailDuplicado(email) {
  const sql = `SELECT id FROM Usuario WHERE email = ?`;
  const row = await dbGet(sql, [email]);
  return !!row;
}

async function cadastrarUsuario({ email, senha }) {
  const sql = `INSERT INTO Usuario (email, senha) VALUES (?, ?)`;
  await dbRun(sql, [email, senha]);
}

module.exports = { verificarEmailDuplicado, cadastrarUsuario };
