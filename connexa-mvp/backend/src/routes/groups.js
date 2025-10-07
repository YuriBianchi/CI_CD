const express = require("express");
const router = express.Router();
const controller = require("../controllers/groupController");

const { authenticateJWT } = require("../middleware/auth");
// Create group (protegido)
router.post("/", authenticateJWT, controller.createGroup);

module.exports = router;
