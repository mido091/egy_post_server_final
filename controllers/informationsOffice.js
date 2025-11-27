const db = require("../config/db");

// =======================
//  GET ALL information
// =======================
exports.getAllInformation = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM information_office ORDER BY id ASC");
    return res.json({ success: true, data: rows });
  } catch (err) {
    console.error("Get All Information Error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
