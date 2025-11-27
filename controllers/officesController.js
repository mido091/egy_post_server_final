const db = require("../config/db");
const { geocodeXY } = require("../utils/mercator");

// =========================
// List Offices
// =========================
exports.list = async (req, res) => {
  try {
    const sql = `
      SELECT gov_code, id, name, address, postal_code, phone1, phone2, x, y
      FROM post_offices
      ORDER BY CAST(gov_code AS UNSIGNED), id
    `;

    const [rows] = await db.query(sql);

    const govMap = {
      "01": "القاهرة",
      "02": "الإسكندرية",
      "03": "بورسعيد",
      "04": "السويس",
      11: "دمياط",
      12: "الدقهلية",
      13: "الشرقية",
      14: "القليوبية",
      15: "كفر الشيخ",
      16: "الغربية",
      17: "المنوفية",
      18: "البحيرة",
      19: "الإسماعيلية",
      21: "الجيزة",
      22: "بني سويف",
      23: "الفيوم",
      24: "المنيا",
      25: "أسيوط",
      26: "سوهاج",
      27: "قنا",
      28: "أسوان",
      29: "الأقصر",
      31: "البحر الأحمر",
      32: "الوادي الجديد",
      33: "مطروح",
      34: "شمال سيناء",
      35: "جنوب سيناء",
    };

    const grouped = {};

    rows.forEach((r) => {
      let code = String(r.gov_code || "").trim();

      if (!code) return;

      if (code.length === 1) code = "0" + code;

      const name = govMap[code] || "غير معروف";

      if (!grouped[name]) grouped[name] = [];
      grouped[name].push(r);
    });

    res.json(grouped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// =========================
// Get One Office
// =========================
exports.getOne = async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await db.query("SELECT * FROM post_offices WHERE id=?", [
      id,
    ]);

    if (!rows.length) return res.status(404).json({ message: "Not found" });

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// =========================
// Create Office
// =========================
exports.create = async (req, res) => {
  const body = req.body;

  // Validate required fields: name and gov_code
  if (!body.name || !body.gov_code) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: name and gov_code are required",
    });
  }

  let lat = null,
    lng = null;

  if (body.x && body.y) {
    const converted = geocodeXY(body.x, body.y);
    lat = converted.lat;
    lng = converted.lng;
  }

  try {
    const sql = `
      INSERT INTO post_offices
      (gov_code, name, address, postal_code, phone1, phone2, x, y)
      VALUES (?,?,?,?,?,?,?,?)`;

    const params = [
      body.gov_code,
      body.name,
      body.address || null,
      body.postal_code || null,
      body.phone1 || null,
      body.phone2 || null,
      body.x || null,
      body.y || null,
    ];

    const [result] = await db.query(sql, params);

    // Fetch the inserted record
    const [insertedRow] = await db.query(
      "SELECT * FROM post_offices WHERE id = ?",
      [result.insertId]
    );

    res.json({
      success: true,
      message: "Created",
      data: insertedRow[0],
    });
  } catch (err) {
    console.error("Create Office Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

// =========================
// Update Office
// =========================
exports.update = async (req, res) => {
  const id = req.params.id;
  const body = req.body;

  const fields = [];
  const params = [];

  [
    "gov_code",
    "name",
    "address",
    "postal_code",
    "phone1",
    "phone2",
    "x",
    "y",
  ].forEach((k) => {
    if (body.hasOwnProperty(k)) {
      fields.push(`${k}=?`);
      params.push(body[k]);
    }
  });

  if (!fields.length)
    return res.status(400).json({ message: "No fields to update" });

  params.push(id);

  try {
    const sql = `UPDATE post_offices SET ${fields.join(", ")} WHERE id=?`;
    await db.query(sql, params);
    res.json({ message: "Updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// =========================
// Delete Office
// =========================
exports.remove = async (req, res) => {
  const id = req.params.id;

  try {
    await db.query("DELETE FROM post_offices WHERE id=?", [id]);
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
