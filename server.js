const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const router = express.Router();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Controllers
const auth = require("./controllers/authController");
const users = require("./controllers/users.controller");
const posts = require("./controllers/officesController");
const about = require("./controllers/pageController");
const social = require("./controllers/socialController");
const informations = require("./controllers/informationsOffice");

// Routes
const settingsRoutes = require("./routes/settings");

// Middleware
const {
  verifyToken,
  isOwner,
  isAdminOrEditor,
  isOwnerOrAdmin,
} = require("./middleware/auth");

// =======================
// AUTH
// =======================
router.post("/auth/register", verifyToken, isOwner, auth.register);
router.post("/auth/login", auth.login);

// =======================
// USERS (Owner)
// =======================
router.get("/users", verifyToken, isOwner, users.getAll);
router.get("/users/:id", verifyToken, isOwner, users.getOne);
router.post("/users", verifyToken, isOwner, users.create);
router.put("/users/:id", verifyToken, isOwner, users.update);
router.delete("/users/:id", verifyToken, isOwner, users.delete);

// =======================
// POSTS
// =======================

// PUBLIC
router.get("/posts", posts.list);
router.get("/posts/:id", posts.getOne);

// CREATE (admin/editor/owner)
router.post("/posts", verifyToken, isAdminOrEditor, posts.create);

// UPDATE (admin/editor/owner)
router.put("/posts/:id", verifyToken, isAdminOrEditor, posts.update);

// DELETE (admin/owner)
router.delete("/posts/:id", verifyToken, isOwnerOrAdmin, posts.remove);

// =======================
// INFORMATIONS
// =======================
router.get("/informations", informations.getAllInformation);

// =======================
// ABOUT
// =======================
router.get("/about", about.getAllSections);
router.get("/about/:id", about.getSectionByKey);
router.post("/about", verifyToken, isOwner, about.createSection);
router.put("/about/:id", verifyToken, isOwner, about.updateSection);
router.delete("/about/:id", verifyToken, isOwner, about.deleteSection);

// =======================
// SOCIAL LINKS
// =======================
router.get("/social", social.getAllLinks);
router.post("/social", verifyToken, isOwner, social.createLink);
router.put("/social/:id", verifyToken, isOwner, social.updateLink);
router.delete("/social/:id", verifyToken, isOwner, social.deleteLink);

// Mount router with /api prefix
app.use("/api", router);

// Mount settings routes
app.use("/api/settings", settingsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on", PORT));
