const db = require("../config/db");

// =======================
//  GET ALL SECTIONS
// =======================
exports.getAllSections = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM about_sections ORDER BY id ASC"
    );
    return res.json({ success: true, data: rows });
  } catch (err) {
    console.error("Get All Sections Error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// =======================
//  GET ONE SECTION BY KEY
// =======================
exports.getSectionByKey = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM about_sections WHERE id = 1");

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Section not found" });
    }

    return res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error("Get Section Error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// =======================
//  CREATE SECTION
//  ONLY OWNER
// =======================
exports.createSection = async (req, res) => {
  const { title_ar, title_en } = req.body;

  try {
    if (!title_ar || !title_en) {
      return res.status(400).json({
        success: false,
        message: "title_ar and title_en are required",
      });
    }

    await db.query(
      `INSERT INTO about_sections 
      ( title_ar, title_en)
      VALUES (?, ?)`,
      [title_ar, title_en]
    );

    return res.json({ success: true, message: "Section created successfully" });
  } catch (err) {
    console.error("Create Section Error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// =======================
//  UPDATE SECTION
//  ONLY OWNER
// =======================
exports.updateSection = async (req, res) => {
  const { title_ar, title_en } = req.body;

  try {
    await db.query(
      `UPDATE about_sections SET 
        title_ar = ?, 
        title_en = ?
       WHERE id = 1`,
      [title_ar, title_en]
    );

    return res.json({ success: true, message: "Section updated successfully" });
  } catch (err) {
    console.error("Update Section Error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// =======================
//  DELETE SECTION
//  ONLY OWNER
// =======================
exports.deleteSection = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT id FROM about_sections WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Section not found" });
    }

    await db.query("DELETE FROM about_sections WHERE id = ?", [id]);

    return res.json({ success: true, message: "Section deleted successfully" });
  } catch (err) {
    console.error("Delete Section Error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
