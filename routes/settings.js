const express = require("express");
const router = express.Router();
const controller = require("../controllers/settingsController");
const { verifyToken, isOwner } = require("../middleware/auth");
const upload = require("../middleware/upload");

// =============================
// PUBLIC ROUTES
// =============================

// Get all settings
router.get("/", controller.getSettings);

// =============================
// OWNER ONLY ROUTES
// =============================

// Update all settings
router.put("/", verifyToken, isOwner, controller.updateSettings);

// Upload logo (changed from PUT to POST)
router.post(
  "/logo",
  verifyToken,
  isOwner,
  upload.single("logo"),
  controller.updateLogo
);

// Upload dark logo (changed from PUT to POST)
router.post(
  "/logo-dark",
  verifyToken,
  isOwner,
  upload.single("logo"),
  controller.updateLogoDark
);

// Update language
router.patch("/language", verifyToken, isOwner, controller.updateLanguage);

// Update dark mode
router.patch("/dark-mode", verifyToken, isOwner, controller.updateDarkMode);

// Update Google Ads
router.patch("/google-ads", verifyToken, isOwner, controller.updateGoogleAds);

// Update Google Analytics
router.patch(
  "/google-analytics",
  verifyToken,
  isOwner,
  controller.updateGoogleAnalytics
);

module.exports = router;
