const groupService = require("../services/groupService");

async function createGroup(req, res) {
  try {
    const { assunto, tema, descricao } = req.body || {};
    const final = assunto || tema;
    if (!final || typeof final !== "string" || final.trim() === "") {
      return res
        .status(400)
        .json({ error: 'O campo "assunto" é obrigatório.' });
    }

    const created = await groupService.createGroup({
      assunto: final.trim(),
      descricao,
    });
    return res.status(201).json(created);
  } catch (err) {
    console.error("controller.createGroup error", err);
    return res.status(500).json({ error: "Erro interno" });
  }
}

module.exports = { createGroup };
