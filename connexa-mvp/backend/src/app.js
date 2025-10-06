const express = require("express");
const groupsRouter = require("./routes/groups");
const db = require("./db");

const createApp = async () => {
  await db.init();
  const app = express();
  app.use(express.json());
  app.use("/api/groups", groupsRouter);
  // health
  app.get("/health", (req, res) => res.send("ok"));
  return app;
};

module.exports = createApp;
