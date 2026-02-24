const { poolPromise, sql } = require("../db");

const deactivateEmployee = async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;
  const adminId = req.user.employee_id;

  const pool = await poolPromise;
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();

    // 1️⃣ Get employee + personal details
    const getRequest = new sql.Request(transaction);

    const result = await getRequest
      .input("employee_id", sql.Int, id)
      .input("email", sql.VarChar, email)
      .query(`
        SELECT e.*, 
               p.phone,
               p.address,
               p.gender,
               p.date_of_birth,
               p.emergency_contact
        FROM employees e
        LEFT JOIN employee_personal_details p
          ON e.employee_id = p.employee_id
        WHERE e.employee_id = @employee_id
        AND e.email = @email
      `);

    if (!result.recordset.length) {
      await transaction.rollback();
      return res.status(400).json({
        message: "Employee ID and Email do not match"
      });
    }

    const emp = result.recordset[0];

    // 🚨 NEW CHECK
    if (emp.status === false || emp.status === 'Inactive') {
      await transaction.rollback();
      return res.status(400).json({
        message: "Employee is already deactivated"
      });
    }

    // 2️⃣ Insert into history
    const insertRequest = new sql.Request(transaction);

    await insertRequest
      .input("employee_id", sql.Int, emp.employee_id)
      .input("full_name", sql.VarChar, emp.full_name)
      .input("email", sql.VarChar, emp.email)
      .input("designation", sql.VarChar, emp.designation)
      .input("salary", sql.Decimal(10,2), emp.salary)
      .input("role_id", sql.Int, emp.role_id)
      .input("department_id", sql.Int, emp.department_id)
      .input("manager_id", sql.Int, emp.manager_id)
      .input("status", sql.Bit, emp.status)
      .input("phone", sql.VarChar, emp.phone)
      .input("address", sql.VarChar, emp.address)
      .input("gender", sql.VarChar, emp.gender)
      .input("date_of_birth", sql.Date, emp.date_of_birth)
      .input("emergency_contact", sql.VarChar, emp.emergency_contact)
      .input("removed_by", sql.Int, adminId)
      .query(`
        INSERT INTO employee_history
        (employee_id, full_name, email, designation, salary,
         role_id, department_id, manager_id, status,
         phone, address, gender, date_of_birth, emergency_contact,
         removed_by)
        VALUES
        (@employee_id, @full_name, @email, @designation, @salary,
         @role_id, @department_id, @manager_id, @status,
         @phone, @address, @gender, @date_of_birth, @emergency_contact,
         @removed_by)
      `);

    // 3️⃣ Update employee to inactive
    const updateRequest = new sql.Request(transaction);

    await updateRequest
      .input("employee_id", sql.Int, id)
      .query(`
        UPDATE employees
        SET status = 'Inactive'
        WHERE employee_id = @employee_id
      `);

    await transaction.commit();

    res.json({ message: "Employee deactivated successfully" });

  } catch (err) {
    await transaction.rollback();
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { deactivateEmployee };