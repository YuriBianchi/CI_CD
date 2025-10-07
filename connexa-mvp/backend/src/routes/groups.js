const express = require("express");
const router = express.Router();
const controller = require("../controllers/groupController");

const { authenticateJWT } = require("../middleware/auth");
// Create group (protegido)
router.post("/", authenticateJWT, controller.createGroup);
// Join group
router.post("/:id/join", authenticateJWT, controller.joinGroup);

module.exports = router;
