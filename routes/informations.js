const express = require("express");
const router = express.Router();

// =======================
//  GET ALL information
// =======================
router.get("/", informations.getAllInformation);

module.exports = router;
