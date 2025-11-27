const express = require("express");
const router = express.Router();

// تأكد إن اسم الملف مطابق 100%
const users = require("../controllers/users.controller");

// GET ALL USERS
router.get("/", users.getAll);

// GET ONE USER
router.get("/:id", users.getOne);

// CREATE USER
router.post("/", users.create);

// UPDATE USER
router.put("/:id", users.update);

// DELETE USER
router.delete("/:id", users.delete);

module.exports = router;
