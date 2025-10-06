const path = require("path");
const dbConfig = require("../database/index");
const sqlite3 = require("sqlite3").verbose();

const dbPath = dbConfig.getDbPath();
console.log("Using DB file:", dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Failed to open DB:", err.message);
    process.exit(1);
  }
});

db.get("SELECT COUNT(*) AS cnt FROM Usuarios", (err, row) => {
  if (err) {
    console.error("Query error:", err.message);
    process.exit(1);
  }
  console.log("Usuarios count:", row.cnt);
  db.close();
});
