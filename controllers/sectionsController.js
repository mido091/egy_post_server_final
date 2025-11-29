const db = require("../config/db");
const path = require("path");
const fs = require("fs");

// =============================
// GET FIRST SECTION (Public)
// =============================
exports.getFirstSection = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM sections WHERE id = 1 LIMIT 1"
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    return res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error("Get Section Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

// =============================
// UPDATE FIRST SECTION (OWNER)
// =============================
exports.updateFirstSection = async (req, res) => {
  const { title, descv, title_en, descv_en } = req.body;

  // Debug logging
  console.log("PUT /sections - Request received");
  console.log("Body:", req.body);
  console.log("File uploaded:", req.file ? "YES" : "NO");
  if (req.file) {
    console.log("File details:", {
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });
  }

  try {
    // Check if section exists
    const [existing] = await db.query("SELECT * FROM sections WHERE id = 1");
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Section with id = 1 not found",
      });
    }

    let imagePath = existing[0].image; // Keep existing image by default

    // If new image is uploaded
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
      console.log("New image path:", imagePath);

      // Delete old image if exists
      if (
        existing[0].image &&
        fs.existsSync(path.join(__dirname, "..", existing[0].image))
      ) {
        try {
          fs.unlinkSync(path.join(__dirname, "..", existing[0].image));
          console.log("Old image deleted:", existing[0].image);
        } catch (unlinkErr) {
          console.error("Error deleting old image:", unlinkErr);
        }
      }
    } else {
      console.log("No file uploaded, keeping existing image:", imagePath);
    }

    // Update the section
    await db.query(
      `UPDATE sections SET 
        title = ?, 
        image = ?, 
        descv = ?, 
        title_en = ?, 
        descv_en = ? 
      WHERE id = 1`,
      [
        title || null,
        imagePath,
        descv || null,
        title_en || null,
        descv_en || null,
      ]
    );

    console.log("Database updated successfully");

    // Fetch and return updated section
    const [updated] = await db.query("SELECT * FROM sections WHERE id = 1");

    return res.json({
      success: true,
      message: "Section updated successfully",
      data: updated[0],
    });
  } catch (err) {
    console.error("Update Section Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

// =============================
// CREATE OR UPDATE FIRST SECTION (OWNER)
// =============================
exports.createOrUpdateFirstSection = async (req, res) => {
  const { title, descv, title_en, descv_en } = req.body;

  // Debug logging
  console.log("POST /sections - Request received");
  console.log("Body:", req.body);
  console.log("File uploaded:", req.file ? "YES" : "NO");
  if (req.file) {
    console.log("File details:", {
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });
  }

  try {
    // Check if section exists
    const [existing] = await db.query("SELECT * FROM sections WHERE id = 1");

    let imagePath = null;
    let oldImagePath = null;

    // If row exists, get the old image path
    if (existing.length > 0) {
      oldImagePath = existing[0].image;
      imagePath = oldImagePath; // Keep existing image by default
    }

    // If new image is uploaded
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
      console.log("New image path:", imagePath);

      // Delete old image if exists and we're updating
      if (
        oldImagePath &&
        fs.existsSync(path.join(__dirname, "..", oldImagePath))
      ) {
        try {
          fs.unlinkSync(path.join(__dirname, "..", oldImagePath));
          console.log("Old image deleted:", oldImagePath);
        } catch (unlinkErr) {
          console.error("Error deleting old image:", unlinkErr);
        }
      }
    } else {
      console.log("No file uploaded, image path:", imagePath);
    }

    // Insert or update using ON DUPLICATE KEY UPDATE
    await db.query(
      `INSERT INTO sections (id, title, image, descv, title_en, descv_en) 
       VALUES (1, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
         title = VALUES(title), 
         image = VALUES(image), 
         descv = VALUES(descv), 
         title_en = VALUES(title_en), 
         descv_en = VALUES(descv_en)`,
      [
        title || null,
        imagePath,
        descv || null,
        title_en || null,
        descv_en || null,
      ]
    );

    console.log("Database updated successfully");

    // Fetch and return the inserted/updated section
    const [result] = await db.query("SELECT * FROM sections WHERE id = 1");

    return res.status(existing.length > 0 ? 200 : 201).json({
      success: true,
      message:
        existing.length > 0
          ? "Section updated successfully"
          : "Section created successfully",
      data: result[0],
    });
  } catch (err) {
    console.error("Create/Update Section Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};
