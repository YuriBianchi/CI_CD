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

async function joinGroup(req, res) {
  try {
    const grupoId = parseInt(req.params.id, 10);
    if (!grupoId) return res.status(400).json({ error: "grupoId inválido" });
    const usuarioId = req.user && req.user.sub;
    if (!usuarioId)
      return res.status(401).json({ error: "É necessário autenticar-se" });
    const result = await groupService.joinGroup({ grupoId, usuarioId });
    if (!result.success) return res.status(400).json({ error: result.error });
    return res.status(200).json({ message: "Entrou no grupo com sucesso" });
  } catch (err) {
    console.error("controller.joinGroup error", err);
    return res.status(500).json({ error: "Erro interno" });
  }
}

module.exports = { createGroup, joinGroup };
