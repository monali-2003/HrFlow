const express = require("express");
const router = express.Router();
const { addEmployee } = require("../controllers/employeeController");
const { verifyToken } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

router.post(
  "/add",
  verifyToken,
  allowRoles("Admin"),
  addEmployee
);

module.exports = router;