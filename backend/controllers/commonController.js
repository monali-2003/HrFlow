const { poolPromise } = require("../db");

/* ---------- GET ROLES ---------- */
const getRoles = async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request().query(`
      SELECT role_id, role_name
      FROM roles
      ORDER BY role_name
    `);

    res.json({ roles: result.recordset });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ---------- GET DEPARTMENTS ---------- */
const getDepartments = async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request().query(`
      SELECT department_id, department_name
      FROM departments
      ORDER BY department_name
    `);

    res.json({ departments: result.recordset });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ---------- GET MANAGERS ---------- */
const getManagers = async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request().query(`
      SELECT employee_id, full_name
      FROM employees
      WHERE role_id = (
        SELECT role_id FROM roles WHERE role_name = 'Manager'
      )
      AND status= 'Active'
      ORDER BY full_name
    `);

    res.json({ managers: result.recordset });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getRoles,
  getDepartments,
  getManagers
};
