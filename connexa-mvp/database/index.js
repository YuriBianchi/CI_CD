const path = require("path");
const fs = require("fs");

const DB_DIR = path.join(__dirname);
const DB_FILE = path.join(DB_DIR, "connexa.db");

function ensureDir() {
  if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
}

function getDbPath() {
  ensureDir();
  return DB_FILE;
}

module.exports = { getDbPath, DB_DIR, DB_FILE };
