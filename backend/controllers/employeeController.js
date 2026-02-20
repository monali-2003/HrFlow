const bcrypt = require("bcrypt");
const { poolPromise, sql } = require("../db");

const addEmployee = async (req, res) => {
  try {
    const {
      full_name,
      email,
      password,
      designation,
      salary,
      role_id,
      department_id,
      manager_id
    } = req.body;

    // 1. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. Get DB connection
    const pool = await poolPromise;

    // 3. Insert employee
    await pool.request()
      .input("full_name", sql.VarChar, full_name)
      .input("email", sql.VarChar, email)
      .input("password_hash", sql.VarChar, hashedPassword)
      .input("designation", sql.VarChar, designation)
      .input("salary", sql.Decimal(10, 2), salary)
      .input("role_id", sql.Int, role_id)
      .input("department_id", sql.Int, department_id)
      .input("manager_id", sql.Int, manager_id)
      .query(`
        INSERT INTO employees
        (full_name, email, password_hash, designation, salary, role_id, department_id, manager_id)
        VALUES
        (@full_name, @email, @password_hash, @designation, @salary, @role_id, @department_id, @manager_id)
      `);

    res.status(201).json({
      message: "Employee added successfully"
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

module.exports = { addEmployee };
