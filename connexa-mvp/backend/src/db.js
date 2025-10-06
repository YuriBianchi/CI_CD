const sqlite3 = require("sqlite3").verbose();
const path = require("path");
// allow tests to override DB path via TEST_DB
const dbPathFromEnv = process.env.TEST_DB;
let dbFile;
try {
  const dbConfig = require(path.join(
    __dirname,
    "..",
    "..",
    "database",
    "index.js"
  ));
  dbFile = dbPathFromEnv || dbConfig.getDbPath();
} catch (e) {
  // fallback to previous behavior if database/index.js is not available
  dbFile =
    dbPathFromEnv ||
    path.join(__dirname, "..", "..", "database", "connexa.sqlite");
}

const db = new sqlite3.Database(dbFile, (err) => {
  if (err) {
    console.error("Failed to open database:", err.message);
    process.exit(1);
  }
});

function init() {
  const createTableSql = `
    CREATE TABLE IF NOT EXISTS GrupoEstudo (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      assunto TEXT NOT NULL,
      descricao TEXT,
      criadoPor INTEGER
    )
  `;
  return new Promise((resolve, reject) => {
    db.run(createTableSql, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

function close() {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

function insertGrupoEstudo({ assunto, descricao, criadoPor }) {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO GrupoEstudo (assunto, descricao, criadoPor) VALUES (?, ?, ?)`;
    db.run(
      sql,
      [assunto, descricao || null, criadoPor || null],
      function (err) {
        if (err) return reject(err);
        const id = this.lastID;
        resolve({
          id,
          assunto,
          descricao: descricao || null,
          criadoPor: criadoPor || null,
        });
      }
    );
  });
}

function clearAll() {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM GrupoEstudo`, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

module.exports = { db, init, close, insertGrupoEstudo, clearAll };
