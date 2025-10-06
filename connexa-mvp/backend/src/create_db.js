const sqlite3 = require("sqlite3").verbose();
const dbConfig = require("../../database/index");
const dbFile = dbConfig.getDbPath();

console.log("Creating DB at", dbFile);
const db = new sqlite3.Database(dbFile, (err) => {
  if (err) {
    console.error("Failed to open database:", err.message);
    process.exit(1);
  }
});

const sql = `
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS GrupoEstudo (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  assunto TEXT NOT NULL,
  descricao TEXT,
  criadoPor INTEGER
);
`;

db.exec(sql, (err) => {
  if (err) {
    console.error("Error creating tables:", err);
    process.exit(1);
  }
  console.log("Tables created successfully");
  db.close();
});
