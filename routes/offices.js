// office
const express = require("express");
const router = express.Router();
const officesController = require("../controllers/officesController");

const {
  verifyToken,
  hasRole,
  isOwner,
  isAdmin,
  isEditor,
} = require("../middleware/auth");

// Public
router.get("/", officesController.list);
router.get("/:id", officesController.getOne);

router.post(
  "/",
  verifyToken,
  hasRole("admin", "editor"),
  officesController.create
);
router.put(
  "/:id",
  verifyToken,
  hasRole("admin", "editor"),
  officesController.update
);
router.delete(
  "/:id",
  verifyToken,
  hasRole("owner", "admin"),
  officesController.remove
);

module.exports = router;
