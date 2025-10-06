const express = require("express");
const groupsRouter = require("./routes/groups");
const usersRouter = require("../routes/usuarios");
const db = require("./db");

const createApp = async () => {
  await db.init();
  const app = express();
  app.use(express.json());
  app.use("/api/groups", groupsRouter);
  app.use("/api/usuarios", usersRouter);
  // Serve the frontend assets under /api/groups/frontend
  const frontendPath = require("path").join(__dirname, "..", "..", "frontend");
  app.use("/api/groups/frontend", express.static(frontendPath));
  // Serve the create-group page at /api/groups/create-group
  app.get("/api/groups/create-group", (req, res) => {
    res.sendFile(require("path").join(frontendPath, "index.html"));
  });
  // health
  app.get("/health", (req, res) => res.send("ok"));
  return app;
};

module.exports = createApp;
