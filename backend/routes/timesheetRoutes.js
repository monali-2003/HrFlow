const express = require("express");
const router = express.Router();

const { submitTimesheet } = require("../controllers/timesheetController");
const { verifyToken } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");
const { approveRejectTimesheet } = require("../controllers/timesheetController");
const { getPendingTimesheetsForManager } = require("../controllers/timesheetController");
const { getMyTimesheets } = require("../controllers/timesheetController");
// Employee submits timesheet
router.post(
  "/submit",
  verifyToken,
  allowRoles("Employee"),
  submitTimesheet
);

router.put(
  "/approve-reject",
  verifyToken,
  allowRoles("Manager"),
  approveRejectTimesheet
);
router.get(
  "/manager/pending",
  verifyToken,
  allowRoles("Manager"),
  getPendingTimesheetsForManager
);
router.get(
  "/my",
  verifyToken,
  allowRoles("Employee"),
  getMyTimesheets
);
module.exports = router;
