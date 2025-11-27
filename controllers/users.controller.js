const db = require('../config/db');
const bcrypt = require('bcryptjs');

// GET ALL USERS
exports.getAll = async (req, res) => {
    try {
        const [users] = await db.query("SELECT id, username, role FROM users");
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// get user by id
exports.getOne = async (req, res) => {
    try {
        const [user] = await db.query("SELECT id, username, role FROM users WHERE id=?", [req.params.id]);
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// CREATE USER
exports.create = async (req, res) => {
    try {
        const { username, password, role } = req.body;

        if (!username || !password) {
            return res.status(400).json({ msg: "Missing fields" });
        }

        const hashed = await bcrypt.hash(password, 10);

        await db.query(
            "INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)",
            [username, hashed, role]
        );

        res.json({ msg: "User created successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// UPDATE USER
exports.update = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const id = req.params.id;

        let query = "UPDATE users SET username=?,  role=?";
        let params = [username, role];

        if (password) {
            const hashed = await bcrypt.hash(password, 10);
            query = "UPDATE users SET username=?, password_hash=?, role=?";
            params = [username, hashed, role];
        }

        query += " WHERE id=?";
        params.push(id);

        await db.query(query, params);

        res.json({ msg: "User updated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE USER
exports.delete = async (req, res) => {
    try {
        const id = req.params.id;

        await db.query("DELETE FROM users WHERE id=?", [id]);

        res.json({ msg: "deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
