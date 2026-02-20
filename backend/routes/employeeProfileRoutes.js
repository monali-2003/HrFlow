const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const {
  getMyProfile,
  updateMyProfile
} = require("../controllers/employeeProfileController");

router.get("/profile", verifyToken, getMyProfile);
router.put("/profile", verifyToken, updateMyProfile);

module.exports = router;
