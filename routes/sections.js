const express = require("express");
const router = express.Router();
const controller = require("../controllers/sectionsController");
const { verifyToken, isOwner } = require("../middleware/auth");
const upload = require("../middleware/upload");

// =============================
// PUBLIC ROUTES
// =============================

// Get first section (id = 1)
router.get("/", controller.getFirstSection);

// =============================
// OWNER ONLY ROUTES
// =============================

// Update first section (id = 1) with optional image upload
router.put(
  "/",
  verifyToken,
  isOwner,
  upload.single("image"),
  controller.updateFirstSection
);

// Create or update first section (id = 1) with optional image upload
router.post(
  "/",
  verifyToken,
  isOwner,
  upload.single("image"),
  controller.createOrUpdateFirstSection
);

module.exports = router;
