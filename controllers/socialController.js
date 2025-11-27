const db = require("../config/db");

// =======================
//  GET ALL SOCIAL LINKS
// =======================
exports.getAllLinks = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM social_links ORDER BY id DESC"
    );

    return res.json({ success: true, data: rows });
  } catch (err) {
    console.error("Get Social Links Error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// =======================
//  GET LINK BY PROVIDER
// =======================
exports.getByProvider = async (req, res) => {
  const { provider } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT * FROM social_links WHERE provider = ?",
      [provider]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Provider Not Found" });
    }

    return res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error("Get Social Link Error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// =======================
//  CREATE SOCIAL LINK
//  ONLY OWNER
// =======================
exports.createLink = async (req, res) => {
  const { provider, url, icon } = req.body;

  if (!provider || !url) {
    return res.status(400).json({
      success: false,
      message: "provider and url are required",
    });
  }

  try {
    const [exists] = await db.query(
      "SELECT id FROM social_links WHERE provider = ?",
      [provider]
    );

    if (exists.length > 0) {
      return res.status(400).json({
        success: false,
        message: "This provider already exists",
      });
    }

    await db.query(
      `INSERT INTO social_links (provider, url, icon)
       VALUES (?, ?, ?)`,
      [provider, url, icon]
    );

    return res.json({ success: true, message: "Social link added successfully" });
  } catch (err) {
    console.error("Create Social Link Error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// =======================
//  UPDATE SOCIAL LINK
//  ONLY OWNER
// =======================
exports.updateLink = async (req, res) => {
  const { provider } = req.params;
  const { url, icon } = req.body;

  try {
    const [exists] = await db.query(
      "SELECT id FROM social_links WHERE provider = ?",
      [provider]
    );

    if (exists.length === 0) {
      return res.status(404).json({ success: false, message: "Provider not found" });
    }

    await db.query(
      `UPDATE social_links 
       SET url = ?, icon = ?
       WHERE provider = ?`,
      [url, icon, provider]
    );

    return res.json({ success: true, message: "Social link updated successfully" });
  } catch (err) {
    console.error("Update Social Link Error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// =======================
//  DELETE SOCIAL LINK
//  ONLY OWNER
// =======================
exports.deleteLink = async (req, res) => {
  const { provider } = req.params;

  try {
    const [exists] = await db.query(
      "SELECT id FROM social_links WHERE provider = ?",
      [provider]
    );

    if (exists.length === 0) {
      return res.status(404).json({ success: false, message: "Provider not found" });
    }

    await db.query("DELETE FROM social_links WHERE provider = ?", [provider]);

    return res.json({ success: true, message: "Social link deleted successfully" });
  } catch (err) {
    console.error("Delete Social Link Error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
