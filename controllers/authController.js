const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.register = async (req, res) => {
  const { username, password, display_name } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "Missing fields" });

  try {
    const [rows] = await db.query("SELECT id FROM users WHERE username=?", [
      username,
    ]);

    if (rows.length) return res.status(400).json({ message: "User exists" });

    const hash = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO users (username, password_hash, display_name) VALUES (?,?,?)",
      [username, hash, display_name || null]
    );

    res.json({ message: "User created", id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "Missing fields" });

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE username=?", [
      username,
    ]);

    if (!rows.length)
      return res.status(401).json({ message: "Invalid credentials" });

    const user = rows[0];

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
