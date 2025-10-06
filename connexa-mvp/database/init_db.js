const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");
const dbConfig = require("./index");

const dbFile = dbConfig.getDbPath();
console.log("DB file will be:", dbFile);

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

CREATE TABLE IF NOT EXISTS Usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  senha TEXT NOT NULL
);

-- seed users
INSERT OR IGNORE INTO Usuarios (nome, email, senha) VALUES ('Yuri', 'yuri@example.com', 'Senha123');
INSERT OR IGNORE INTO Usuarios (nome, email, senha) VALUES ('Eduardo', 'eduardo@example.com', 'Senha123');
INSERT OR IGNORE INTO Usuarios (nome, email, senha) VALUES ('Manoel', 'manoel@example.com', 'Senha123');
INSERT OR IGNORE INTO Usuarios (nome, email, senha) VALUES ('Marco', 'marco@example.com', 'Senha123');
INSERT OR IGNORE INTO Usuarios (nome, email, senha) VALUES ('Lucio', 'lucio@example.com', 'Senha123');
`;

db.exec(sql, (err) => {
  if (err) {
    console.error("Error creating tables:", err);
    process.exit(1);
  }
  console.log("Tables created successfully");
  db.close();
});
