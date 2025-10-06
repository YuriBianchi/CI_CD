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
