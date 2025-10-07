const db = require("../db");

async function createGroup({ assunto, tema, descricao, criadoPor }) {
  const finalAssunto = assunto || tema;
  if (!finalAssunto) throw new Error("assunto is required");

  const created = await db.insertGrupoEstudo({
    assunto: finalAssunto,
    descricao,
    criadoPor,
  });
  return created;
}

module.exports = { createGroup };
async function joinGroup({ grupoId, usuarioId }) {
  const sql = `INSERT INTO GrupoMembros (grupoId, usuarioId) VALUES (?, ?)`;
  try {
    await db.run(sql, [grupoId, usuarioId]);
    return { success: true };
  } catch (err) {
    // unique constraint or other error
    if (err && err.message && err.message.includes("UNIQUE")) {
      return { success: false, error: "Usuario ja faz parte do grupo" };
    }
    throw err;
  }
}

module.exports = { createGroup, joinGroup };
