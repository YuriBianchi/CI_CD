const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Endpoint para cadastro de usuários
router.post("/cadastro", userController.cadastrarUsuario);

module.exports = router;