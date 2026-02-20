const express = require("express");
const router = express.Router();

const {
  getRoles,
  getDepartments,
  getManagers
} = require("../controllers/commonController");

router.get("/roles", getRoles);
router.get("/departments", getDepartments);
router.get("/managers", getManagers);

module.exports = router;
