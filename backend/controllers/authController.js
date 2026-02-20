const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { poolPromise, sql } = require("../db");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const pool = await poolPromise;

    // 1. Get user by email
    const result = await pool.request()
      .input("email", sql.VarChar, email)
      .query(`
        SELECT e.employee_id, e.full_name, e.email, e.password_hash, r.role_name
        FROM employees e
        JOIN roles r ON e.role_id = r.role_id
        WHERE e.email = @email
      `);

    if (result.recordset.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = result.recordset[0];

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 3. Generate JWT
    const token = jwt.sign(
      {
        employee_id: user.employee_id,
        role: user.role_name
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.employee_id,
        name: user.full_name,
        email: user.email,
        role: user.role_name
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { login };
