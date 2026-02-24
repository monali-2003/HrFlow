const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

const {
  getEmployeeFullProfile,
  updateEmployeeFullProfile
} = require("../controllers/adminProfileController");


// GET full employee profile
router.get(
  "/employee/:id",
  verifyToken,
  allowRoles("Admin"),
  getEmployeeFullProfile
);


// UPDATE full employee profile
router.put(
  "/employee/:id",
  verifyToken,
  allowRoles("Admin"),
  updateEmployeeFullProfile
);

module.exports = router;