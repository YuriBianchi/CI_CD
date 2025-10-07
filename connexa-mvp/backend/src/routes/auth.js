const express = require("express");
const router = express.Router();
const controller = require("../controllers/authController");

// agora o ponto de entrada será /api/login (POST /)
router.post("/", controller.login);

module.exports = router;
