const express = require("express");
const router = express.Router();
const controller = require("../controllers/socialController");
const { verifyToken, isOwner } = require("../middleware/auth");

// Public or Admin
router.get("/", verifyToken, controller.getAllLinks);
router.get("/:provider", verifyToken, controller.getByProvider);

// Owner Only
router.post("/", verifyToken, isOwner, controller.createLink);
router.put("/:provider", verifyToken, isOwner, controller.updateLink);
router.delete("/:provider", verifyToken, isOwner, controller.deleteLink);

module.exports = router;
