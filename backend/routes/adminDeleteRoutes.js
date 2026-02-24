const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");
const { deactivateEmployee} = require("../controllers/adminDeleteController");
router.put(
  "/employee/:id/deactivate",
  verifyToken,
  allowRoles("Admin"),
  deactivateEmployee
);

module.exports = router;