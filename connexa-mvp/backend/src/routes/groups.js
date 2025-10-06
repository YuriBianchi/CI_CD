const express = require("express");
const router = express.Router();
const controller = require("../controllers/groupController");

// Create group
router.post("/", controller.createGroup);

module.exports = router;
