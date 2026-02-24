const { poolPromise, sql } = require("../db");


// ==============================
// GET EMPLOYEE FULL PROFILE
// ==============================
const getEmployeeFullProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;

    const result = await pool.request()
      .input("employee_id", sql.Int, id)
      .query(`
        SELECT 
          e.employee_id,
          e.full_name,
          e.email,
          e.designation,
          e.salary,
          e.role_id,
          e.department_id,
          e.manager_id,
          e.status,

          p.phone,
          p.address,
          p.date_of_birth,
          p.gender,
          p.emergency_contact

        FROM employees e
        LEFT JOIN employee_personal_details p
          ON e.employee_id = p.employee_id
        WHERE e.employee_id = @employee_id
      `);

    res.json({ employee: result.recordset[0] });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


// ==============================
// UPDATE EMPLOYEE PROFILE
// ==============================
const updateEmployeeFullProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;

    const {
      full_name,
      email,
      designation,
      salary,
      role_id,
      department_id,
      manager_id,
      status,
      phone,
      address,
      date_of_birth,
      gender,
      emergency_contact
    } = req.body;

    // 🔹 Update work details
    await pool.request()
      .input("employee_id", sql.Int, id)
      .input("full_name", sql.VarChar, full_name)
      .input("email", sql.VarChar, email)
      .input("designation", sql.VarChar, designation)
      .input("salary", sql.Decimal(10, 2), salary)
      .input("role_id", sql.Int, role_id)
      .input("department_id", sql.Int, department_id)
      .input("manager_id", sql.Int, manager_id || null)
      .input("status", sql.Bit, status)
      .query(`
        UPDATE employees
        SET full_name = @full_name,
            email = @email,
            designation = @designation,
            salary = @salary,
            role_id = @role_id,
            department_id = @department_id,
            manager_id = @manager_id,
            status = @status
        WHERE employee_id = @employee_id
      `);

    // 🔹 Update personal details
    await pool.request()
      .input("employee_id", sql.Int, id)
      .input("phone", sql.VarChar, phone)
      .input("address", sql.VarChar, address)
      .input("date_of_birth", sql.Date, date_of_birth|| null)
      .input("gender", sql.VarChar, gender)
      .input("emergency_contact", sql.VarChar, emergency_contact)
      .query(`
        IF EXISTS (SELECT 1 FROM employee_personal_details WHERE employee_id = @employee_id)
        BEGIN
          UPDATE employee_personal_details
          SET phone = @phone,
              address = @address,
              date_of_birth = @date_of_birth,
              gender = @gender,
              emergency_contact = @emergency_contact
          WHERE employee_id = @employee_id
        END
        ELSE
        BEGIN
          INSERT INTO employee_personal_details
          (employee_id, phone, address, date_of_birth, gender, emergency_contact)
          VALUES
          (@employee_id, @phone, @address, @date_of_birth, @gender, @emergency_contact)
        END
      `);

    res.json({ message: "Employee profile updated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
  getEmployeeFullProfile,
  updateEmployeeFullProfile
};