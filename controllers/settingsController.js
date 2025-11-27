const db = require("../config/db");
const path = require("path");
const fs = require("fs");

// =============================
// VALIDATION HELPERS
// =============================

/**
 * Validate email format
 */
const validateEmail = (email) => {
  if (!email) return true; // Email is optional
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate all settings fields
 */
const validateSettings = (data) => {
  const errors = [];

  // Required fields
  if (!data.site_name || data.site_name.trim() === "") {
    errors.push("site_name is required");
  }

  if (!data.site_name_en || data.site_name_en.trim() === "") {
    errors.push("site_name_en is required");
  }

  // Email validation
  if (data.email && !validateEmail(data.email)) {
    errors.push("Invalid email format");
  }

  // Language validation
  if (data.default_language && !["ar", "en"].includes(data.default_language)) {
    errors.push('default_language must be "ar" or "en"');
  }

  // Dark mode validation
  if (
    data.dark_mode !== undefined &&
    ![0, 1, "0", "1", true, false].includes(data.dark_mode)
  ) {
    errors.push("dark_mode must be 0 or 1");
  }

  return errors;
};

// =============================
// GET SETTINGS (Public)
// =============================
exports.getSettings = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM settings LIMIT 1");

    if (!rows || rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Settings not found",
      });
    }

    return res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error("Get Settings Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

// =============================
// UPDATE ALL SETTINGS (OWNER)
// =============================
exports.updateSettings = async (req, res) => {
  const {
    site_name,
    site_name_en,
    site_description,
    site_description_en,
    phone,
    email,
    address,
    default_language,
    dark_mode,
    google_ads_header,
    google_ads_footer,
    google_analytics,
  } = req.body;

  // Validate input
  const validationErrors = validateSettings(req.body);
  if (validationErrors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validationErrors,
    });
  }

  try {
    const [settings] = await db.query("SELECT id FROM settings LIMIT 1");
    if (settings.length === 0) {
      return res.status(500).json({
        success: false,
        message: "Settings row missing!",
      });
    }

    // Convert dark_mode to 0 or 1
    const darkModeValue =
      dark_mode === true || dark_mode === 1 || dark_mode === "1" ? 1 : 0;

    await db.query(
      `
      UPDATE settings SET 
        site_name = ?, 
        site_name_en = ?, 
        site_description = ?, 
        site_description_en = ?, 
        phone = ?, 
        email = ?, 
        address = ?, 
        default_language = ?, 
        dark_mode = ?, 
        google_ads_header = ?, 
        google_ads_footer = ?, 
        google_analytics = ?,
        updated_at = NOW()
      WHERE id = 1
      `,
      [
        site_name,
        site_name_en,
        site_description || null,
        site_description_en || null,
        phone || null,
        email || null,
        address || null,
        default_language || "ar",
        darkModeValue,
        google_ads_header || null,
        google_ads_footer || null,
        google_analytics || null,
      ]
    );

    // Fetch and return updated settings
    const [updated] = await db.query("SELECT * FROM settings WHERE id = 1");

    return res.json({
      success: true,
      message: "Settings updated successfully",
      data: updated[0],
    });
  } catch (err) {
    console.error("Update Settings Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

// =============================
// UPDATE LOGO (OWNER)
// =============================
exports.updateLogo = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Logo file is required",
    });
  }

  const filePath = `/uploads/${req.file.filename}`;

  try {
    const [old] = await db.query("SELECT logo FROM settings WHERE id = 1");

    // Delete old logo if exists
    if (
      old[0]?.logo &&
      fs.existsSync(path.join(__dirname, "..", old[0].logo))
    ) {
      try {
        fs.unlinkSync(path.join(__dirname, "..", old[0].logo));
      } catch (unlinkErr) {
        console.error("Error deleting old logo:", unlinkErr);
      }
    }

    await db.query(
      "UPDATE settings SET logo = ?, updated_at = NOW() WHERE id = 1",
      [filePath]
    );

    // Fetch and return updated settings
    const [updated] = await db.query("SELECT * FROM settings WHERE id = 1");

    return res.json({
      success: true,
      message: "Logo updated successfully",
      logo: filePath,
      data: updated[0],
    });
  } catch (err) {
    console.error("Update Logo Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

// =============================
// UPDATE DARK LOGO (OWNER)
// =============================
exports.updateLogoDark = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Dark logo file is required",
    });
  }

  const filePath = `/uploads/${req.file.filename}`;

  try {
    const [old] = await db.query("SELECT logo_dark FROM settings WHERE id = 1");

    // Delete old dark logo if exists
    if (
      old[0]?.logo_dark &&
      fs.existsSync(path.join(__dirname, "..", old[0].logo_dark))
    ) {
      try {
        fs.unlinkSync(path.join(__dirname, "..", old[0].logo_dark));
      } catch (unlinkErr) {
        console.error("Error deleting old dark logo:", unlinkErr);
      }
    }

    await db.query(
      "UPDATE settings SET logo_dark = ?, updated_at = NOW() WHERE id = 1",
      [filePath]
    );

    // Fetch and return updated settings
    const [updated] = await db.query("SELECT * FROM settings WHERE id = 1");

    return res.json({
      success: true,
      message: "Dark logo updated successfully",
      logo_dark: filePath,
      data: updated[0],
    });
  } catch (err) {
    console.error("Update Dark Logo Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

// =============================
// UPDATE LANGUAGE (OWNER)
// =============================
exports.updateLanguage = async (req, res) => {
  const { default_language } = req.body;

  // Validate language
  if (!default_language || !["ar", "en"].includes(default_language)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid language. Must be "ar" or "en"',
    });
  }

  try {
    await db.query(
      "UPDATE settings SET default_language = ?, updated_at = NOW() WHERE id = 1",
      [default_language]
    );

    // Fetch and return updated settings
    const [updated] = await db.query("SELECT * FROM settings WHERE id = 1");

    return res.json({
      success: true,
      message: "Language updated successfully",
      data: updated[0],
    });
  } catch (err) {
    console.error("Update Language Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

// =============================
// UPDATE DARK MODE (OWNER)
// =============================
exports.updateDarkMode = async (req, res) => {
  const { dark_mode } = req.body;

  // Validate and convert to 0 or 1
  if (dark_mode === undefined || dark_mode === null) {
    return res.status(400).json({
      success: false,
      message: "dark_mode field is required",
    });
  }

  const darkModeValue =
    dark_mode === true || dark_mode === 1 || dark_mode === "1" ? 1 : 0;

  try {
    await db.query(
      "UPDATE settings SET dark_mode = ?, updated_at = NOW() WHERE id = 1",
      [darkModeValue]
    );

    // Fetch and return updated settings
    const [updated] = await db.query("SELECT * FROM settings WHERE id = 1");

    return res.json({
      success: true,
      message: "Dark mode updated successfully",
      data: updated[0],
    });
  } catch (err) {
    console.error("Update Dark Mode Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

// =============================
// UPDATE GOOGLE ADS (OWNER)
// =============================
exports.updateGoogleAds = async (req, res) => {
  const { google_ads_header, google_ads_footer } = req.body;

  try {
    await db.query(
      "UPDATE settings SET google_ads_header = ?, google_ads_footer = ?, updated_at = NOW() WHERE id = 1",
      [google_ads_header || null, google_ads_footer || null]
    );

    // Fetch and return updated settings
    const [updated] = await db.query("SELECT * FROM settings WHERE id = 1");

    return res.json({
      success: true,
      message: "Google Ads updated successfully",
      data: updated[0],
    });
  } catch (err) {
    console.error("Update Google Ads Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

// =============================
// UPDATE GOOGLE ANALYTICS (OWNER)
// =============================
exports.updateGoogleAnalytics = async (req, res) => {
  const { google_analytics } = req.body;

  try {
    await db.query(
      "UPDATE settings SET google_analytics = ?, updated_at = NOW() WHERE id = 1",
      [google_analytics || null]
    );

    // Fetch and return updated settings
    const [updated] = await db.query("SELECT * FROM settings WHERE id = 1");

    return res.json({
      success: true,
      message: "Google Analytics updated successfully",
      data: updated[0],
    });
  } catch (err) {
    console.error("Update Google Analytics Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};
