const express = require("express");
const groupsRouter = require("./routes/groups");
const usersRouter = require("./routes/usuarios");
const db = require("./db");

const createApp = async () => {
  await db.init();
  const app = express();
  app.use(express.json());
  app.use("/api/groups", groupsRouter);
  app.use("/api/usuarios", usersRouter);
  // Serve the frontend assets under /api/groups/frontend
  const frontendPath = require("path").join(__dirname, "..", "..", "frontend");
  app.get("/api/login", (req, res) => {
    res.sendFile(require("path").join(frontendPath, "login.html"));
  });
  // Serve the cadastro page at /api/cadastro.html for convenience
  app.get("/api/cadastro.html", (req, res) => {
    return res.sendFile(require("path").join(frontendPath, "cadastro.html"));
  });
  // Ensure the old static login path does not exist; return 404 so the only login route is /api/login
  app.get("/api/groups/frontend/login.html", (req, res) => {
    return res.status(404).send("Not Found");
  });
  // Serve frontend index (public). API endpoints remain protected.
  app.get("/api/groups/frontend/index.html", (req, res) => {
    return res.sendFile(require("path").join(frontendPath, "index.html"));
  });
  // auth agora é a rota /api/login (POST)
  const authRouter = require("./routes/auth");
  app.use("/api/login", authRouter);
  // Serve the frontend assets under /api/groups/frontend
  app.use("/api/groups/frontend", express.static(frontendPath));
  // Serve the create-group page at /api/groups/create-group (public - actions still require auth)
  app.get("/api/groups/create-group", (req, res) => {
    res.sendFile(require("path").join(frontendPath, "index.html"));
  });
  // health
  app.get("/health", (req, res) => res.send("ok"));
  return app;
};

module.exports = createApp;
