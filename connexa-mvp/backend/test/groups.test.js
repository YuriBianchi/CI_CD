const request = require("supertest");
const path = require("path");
const fs = require("fs");

const TEST_DB = path.join(
  __dirname,
  "..",
  "..",
  "database",
  "test_connexa.sqlite"
);

beforeAll(() => {
  // ensure clean test db
  if (fs.existsSync(TEST_DB)) fs.unlinkSync(TEST_DB);
  process.env.TEST_DB = TEST_DB;
});

afterAll(async () => {
  // ensure DB closed before removing file to avoid EBUSY on Windows
  try {
    const db = require("../src/db");
    if (db && typeof db.close === "function") await db.close();
  } catch (e) {
    // ignore
  }
  if (fs.existsSync(TEST_DB)) fs.unlinkSync(TEST_DB);
});

let app;
beforeEach(async () => {
  delete require.cache[require.resolve("../src/app")];
  app = await require("../src/app")();
});

test("creates a group with tema and optional descricao", async () => {
  const res = await request(app)
    .post("/api/groups")
    .send({ assunto: "Matemática", descricao: "Grupo para revisar cálculo 1" })
    .expect(201);

  expect(res.body).toHaveProperty("id");
  expect(res.body.assunto).toBe("Matemática");
  expect(res.body.descricao).toBe("Grupo para revisar cálculo 1");
  expect(res.body).not.toHaveProperty("created_at");
});

test("accepts `assunto` as alias for tema", async () => {
  const res = await request(app)
    .post("/api/groups")
    .send({ assunto: "Programação" })
    .expect(201);

  expect(res.body.assunto).toBe("Programação");
});

test("returns 400 when tema is missing or empty", async () => {
  await request(app).post("/api/groups").send({}).expect(400);
  await request(app).post("/api/groups").send({ tema: "   " }).expect(400);
});
test("returns 400 when assunto is missing or empty", async () => {
  await request(app).post("/api/groups").send({}).expect(400);
  await request(app).post("/api/groups").send({ assunto: "   " }).expect(400);
});
