const { poolPromise, sql } = require("../db");

/* ================================
   SUBMIT TIMESHEET (EMPLOYEE)
================================ */
const submitTimesheet = async (req, res) => {
  try {
    const employee_id = req.user.employee_id;
    const { week_start_date, entries } = req.body;

    if (!entries || entries.length === 0) {
      return res.status(400).json({ message: "Timesheet entries required" });
    }

    // ✅ Calculate total hours on BACKEND (source of truth)
    const totalHours = entries.reduce(
      (sum, e) => sum + Number(e.hours_worked || 0),
      0
    );

    const pool = await poolPromise;

    // 1️⃣ Insert weekly timesheet (NOW includes total_hours)
    const timesheetResult = await pool.request()
      .input("employee_id", sql.Int, employee_id)
      .input("week_start_date", sql.Date, week_start_date)
      .input("total_hours", sql.Decimal(5, 2), totalHours)
      .query(`
        INSERT INTO timesheets
          (employee_id, week_start_date, total_hours, status)
        OUTPUT INSERTED.timesheet_id
        VALUES
          (@employee_id, @week_start_date, @total_hours, 'Pending')
      `);

    const timesheet_id = timesheetResult.recordset[0].timesheet_id;

    // 2️⃣ Insert daily entries
    for (const entry of entries) {
      await pool.request()
        .input("timesheet_id", sql.Int, timesheet_id)
        .input("work_date", sql.Date, entry.work_date)
        .input("hours_worked", sql.Decimal(4, 2), entry.hours_worked)
        .input("task_description", sql.VarChar, entry.task_description)
        .query(`
          INSERT INTO timesheet_entries
            (timesheet_id, work_date, hours_worked, task_description)
          VALUES
            (@timesheet_id, @work_date, @hours_worked, @task_description)
        `);
    }

    res.status(201).json({
      message: "Timesheet submitted successfully",
      timesheet_id
    });

  } catch (error) {
    if (error.message.includes("uq_employee_week")) {
      return res.status(400).json({
        message: "Timesheet already submitted for this week"
      });
    }

    res.status(500).json({ error: error.message });
  }
};

/* ================================
   APPROVE / REJECT (MANAGER)
================================ */
const approveRejectTimesheet = async (req, res) => {
  try {
    const manager_id = req.user.employee_id;
    const { timesheet_id, action, comments } = req.body;

    if (!["Approved", "Rejected"].includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }

    const pool = await poolPromise;

    // 1️⃣ Update status
    await pool.request()
      .input("timesheet_id", sql.Int, timesheet_id)
      .input("status", sql.VarChar, action)
      .query(`
        UPDATE timesheets
        SET status = @status
        WHERE timesheet_id = @timesheet_id
      `);

    // 2️⃣ Save approval history
    await pool.request()
      .input("timesheet_id", sql.Int, timesheet_id)
      .input("manager_id", sql.Int, manager_id)
      .input("action", sql.VarChar, action)
      .input("comments", sql.VarChar, comments || null)
      .query(`
        INSERT INTO approval_history
          (timesheet_id, manager_id, action, comments)
        VALUES
          (@timesheet_id, @manager_id, @action, @comments)
      `);

    res.json({
      message: `Timesheet ${action.toLowerCase()} successfully`
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================================
   MANAGER DASHBOARD (PENDING)
================================ */
const getPendingTimesheetsForManager = async (req, res) => {
  try {
    const manager_id = req.user.employee_id;
    const pool = await poolPromise;

    const result = await pool.request()
      .input("manager_id", sql.Int, manager_id)
      .query(`
SELECT 
  t.timesheet_id,
  e.full_name AS employee_name,

  CONVERT(varchar(10), t.week_start_date, 23) AS week_start_date,
  CONVERT(varchar(10), DATEADD(day, 6, t.week_start_date), 23) AS week_end_date,

  t.total_hours,
  t.status
FROM timesheets t
JOIN employees e ON t.employee_id = e.employee_id
WHERE e.manager_id = @manager_id
  AND t.status = 'Pending'
ORDER BY t.week_start_date DESC
      `);

    res.json({
      pending_timesheets: result.recordset
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================================
   EMPLOYEE DASHBOARD (HISTORY)
================================ */
const getMyTimesheets = async (req, res) => {
  try {
    const employee_id = req.user.employee_id;
    const pool = await poolPromise;

    const result = await pool.request()
      .input("employee_id", sql.Int, employee_id)
      .query(`
SELECT 
  t.timesheet_id,

  CONVERT(varchar(10), t.week_start_date, 23) AS week_start_date,
  CONVERT(varchar(10), DATEADD(day, 6, t.week_start_date), 23) AS week_end_date,

  t.total_hours,
  t.status,
  ah.comments,
  CONVERT(varchar(10), ah.action_date, 23) AS action_date
FROM timesheets t
LEFT JOIN approval_history ah
  ON t.timesheet_id = ah.timesheet_id
WHERE t.employee_id = @employee_id
ORDER BY t.week_start_date DESC
      `);

    res.json({
      my_timesheets: result.recordset
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  submitTimesheet,
  approveRejectTimesheet,
  getPendingTimesheetsForManager,
  getMyTimesheets
};
