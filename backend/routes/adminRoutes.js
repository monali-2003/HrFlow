const express = require("express");
const router = express.Router();

// ✅ Import middlewares EXACTLY as you have them
const { verifyToken } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

// ✅ Controllers
const { addEmployee } = require("../controllers/employeeController");
const {
  getEmployees,
  updateEmployee,
  deactivateEmployee 
} = require("../controllers/adminController");

/* =======================
   ADMIN ROUTES
======================= */
// add employees
router.post(
  "/add",
  verifyToken,
  allowRoles("Admin"),
  addEmployee
);

// Get all employees
router.get(
  "/",
  verifyToken,
  allowRoles("Admin"),
  getEmployees
);


// Update employee
router.put(
  "/:employee_id",
  verifyToken,
  allowRoles("Admin"),
  updateEmployee
);

router.put(
  "/employees/:id/deactivate",
  verifyToken,
  allowRoles("Admin"),
  deactivateEmployee
);

module.exports = router;
