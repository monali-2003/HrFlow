const { poolPromise, sql } = require("../db");

/* ---------- GET ALL EMPLOYEES ---------- */
const getEmployees = async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request().query(`
      SELECT
        e.employee_id,
        e.full_name,
        e.email,
        e.designation,
        e.salary,
        r.role_name,
        d.department_name,
        e.manager_id,
        e.status
      FROM employees e
      join 
      roles     r
      on e.role_id=r.role_id
      join 
      departments d
      on e.department_id=d.department_id
      where r.role_id!=1
      ORDER BY e.full_name
    `);

    res.json({ employees: result.recordset });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

/* ---------- UPDATE EMPLOYEE ---------- */
const updateEmployee = async (req, res) => {
  try {
    const { employee_id } = req.params;
    const {
      full_name,
      designation,
      salary,
      role_id,
      department_id,
      manager_id,
      status
    } = req.body;

    const pool = await poolPromise;

    await pool.request()
      .input("employee_id", sql.Int, employee_id)
      .input("full_name", sql.VarChar, full_name)
      .input("designation", sql.VarChar, designation)
      .input("salary", sql.Decimal(10, 2), salary)
      .input("role_id", sql.Int, role_id)
      .input("department_id", sql.Int, department_id)
      .input("manager_id", sql.Int, manager_id)
      .input("status", sql.Bit, status)
      .query(`
        UPDATE employees
        SET
          full_name = @full_name,
          designation = @designation,
          salary = @salary,
          role_id = @role_id,
          department_id = @department_id,
          manager_id = @manager_id,
          status= @status
        WHERE employee_id = @employee_id
      `);

    res.json({ message: "Employee updated successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const deactivateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;

    await pool.request()
      .input("employee_id", sql.Int, id)
      .query(`
        UPDATE employees
        SET status = 'Deactivate'
        WHERE employee_id = @employee_id
      `);

    res.json({ message: "Employee removed (deactivated) successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getEmployees,
  updateEmployee, 
  deactivateEmployee 
};
