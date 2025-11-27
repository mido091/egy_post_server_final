const express = require("express");
const router = express.Router();
const controller = require("../controllers/pageController");
const { verifyToken, isOwner } = require("../middleware/auth");

// Public or Admin
router.get("/", verifyToken, controller.getAllSections);
router.get("/", verifyToken, controller.getSectionByKey);

// Owner only
router.post("/", verifyToken, isOwner, controller.createSection);
router.put("/", verifyToken, isOwner, controller.updateSection);
router.delete("/", verifyToken, isOwner, controller.deleteSection);

module.exports = router;
