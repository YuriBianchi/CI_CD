const db = require("../db").db;
const jwt = require("jsonwebtoken");

// secret for JWT; in prod this should be an env var
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-for-tests";
const JWT_EXPIRES_IN = "2h";

function findUserByEmail(email) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT id, nome, email, senha FROM Usuarios WHERE email = ?",
      [email],
      (err, row) => {
        if (err) return reject(err);
        resolve(row);
      }
    );
  });
}

async function authenticate(email, senha) {
  const user = await findUserByEmail(email);
  if (!user) return null;
  // passwords are stored in plain text per instructions
  if (user.senha !== senha) return null;
  const payload = { sub: user.id, nome: user.nome, email: user.email };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  return token;
}

module.exports = { authenticate };
