const sqlite3 = require("sqlite3").verbose();
const dbConfig = require("../../database/index");
const dbFile = process.env.TEST_DB || dbConfig.getDbPath();

const db = new sqlite3.Database(dbFile, (err) => {
  if (err) {
    console.error("Failed to open DB:", err.message);
    process.exit(1);
  }
});

db.all(
  "SELECT name, type, sql FROM sqlite_master WHERE type IN ('table','view') ORDER BY name",
  [],
  (err, rows) => {
    if (err) {
      console.error("Error querying sqlite_master:", err);
      process.exit(1);
    }
    console.log("Tables/views in", dbFile);
    rows.forEach((r) => console.log(r.name, "-", r.type));
    if (rows.length === 0) console.log("(no tables)");
    db.close();
  }
);
