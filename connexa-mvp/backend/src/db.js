const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

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
  dbFile =
    dbPathFromEnv ||
    path.join(__dirname, "..", "..", "database", "connexa.sqlite");
}

// ensure directory exists
const dbDir = path.dirname(dbFile);
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const db = new sqlite3.Database(dbFile, (err) => {
  if (err) {
    console.error("Failed to open database:", err.message);
    process.exit(1);
  }
});

function init() {
  const createUsuarioTableSql = `
    CREATE TABLE IF NOT EXISTS Usuario (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      senha TEXT NOT NULL,
      confirmado INTEGER DEFAULT 0
    );
  `;

  const createGrupoSql = `
    CREATE TABLE IF NOT EXISTS GrupoEstudo (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      assunto TEXT NOT NULL,
      descricao TEXT,
      criadoPor INTEGER
    );
  `;

  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(createUsuarioTableSql, (err) => {
        if (err) return reject(err);
      });
      db.run(createGrupoSql, (err) => {
        if (err) return reject(err);
      });
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

// Promise wrappers for convenience
function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

module.exports = { db, init, close, insertGrupoEstudo, clearAll, get, run };
