const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * ✔️ التحقق من صحة التوكن
 */
function verifyToken(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: "No token provided" });

  const parts = header.split(" ");
  if (parts.length !== 2)
    return res.status(401).json({ message: "Token error" });

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // فيه id + role
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

/**
 * ✔️ Owner فقط
 */
function isOwner(req, res, next) {
  if (!req.user || req.user.role !== "owner")
    return res.status(403).json({ message: "Access denied (Owner only)" });

  next();
}

/**
 * ✔️ Admin أو Editor
 */
function isAdminOrEditor(req, res, next) {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  if (req.user.role === "owner" || req.user.role === "admin" || req.user.role === "editor") return next();

  return res.status(403).json({ message: "Admins or Editors only" });
}

/**
 * ✔️ Owner أو Admin
 */
function isOwnerOrAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  if (req.user.role === "owner" || req.user.role === "admin") return next();

  return res.status(403).json({ message: "Owner or Admin only" });
}

/**
 * ✔️ hasRole(...roles)
 * يمكن استخدامه في أي Route
 */
function hasRole(...roles) {
  return (req, res, next) => {
    if (!req.user)
      return res.status(401).json({ message: "Unauthorized" });

    if (!roles.includes(req.user.role))
      return res.status(403).json({ message: "Access denied" });

    next();
  };
}

module.exports = {
  verifyToken,
  isOwner,
  isAdminOrEditor,
  isOwnerOrAdmin,
  hasRole,
};
