const { poolPromise, sql } = require("../db");

const getMyProfile = async (req, res) => {
  try {
    const employee_id = req.user.employee_id;
    const pool = await poolPromise;

    const result = await pool.request()
      .input("employee_id", sql.Int, employee_id)
      .query(`
        SELECT 
          e.employee_id,
          e.full_name,
          e.email,
          e.designation,
          e.salary,
          e.status,
          d.department_name,
          r.role_name,

          p.phone,
          p.address,
          p.date_of_birth,
          p.emergency_contact,
          p.gender,
          p.blood_group

        FROM employees e
        JOIN roles r ON e.role_id = r.role_id
        JOIN departments d ON e.department_id = d.department_id
        LEFT JOIN employee_personal_details p
          ON e.employee_id = p.employee_id
        WHERE e.employee_id = @employee_id
      `);

    res.json({ profile: result.recordset[0] });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateMyProfile = async (req, res) => {
  try {
    const employee_id = req.user.employee_id;
    const {
      phone,
      address,
      date_of_birth,
      emergency_contact,
      gender,
      blood_group
    } = req.body;

    const pool = await poolPromise;

    await pool.request()
      .input("employee_id", sql.Int, employee_id)
      .input("phone", sql.VarChar, phone)
      .input("address", sql.VarChar, address)
      .input("date_of_birth", sql.Date, date_of_birth)
      .input("emergency_contact", sql.VarChar, emergency_contact)
      .input("gender", sql.VarChar, gender)
      .input("blood_group", sql.VarChar, blood_group)
      .query(`
        MERGE employee_personal_details AS target
        USING (SELECT @employee_id AS employee_id) AS source
        ON target.employee_id = source.employee_id
        WHEN MATCHED THEN
          UPDATE SET
            phone=@phone,
            address=@address,
            date_of_birth=@date_of_birth,
            emergency_contact=@emergency_contact,
            gender=@gender,
            blood_group=@blood_group,
            updated_at=GETDATE()
        WHEN NOT MATCHED THEN
          INSERT (employee_id, phone, address, date_of_birth,
                  emergency_contact, gender, blood_group)
          VALUES (@employee_id, @phone, @address, @date_of_birth,
                  @emergency_contact, @gender, @blood_group);
      `);

    res.json({ message: "Profile updated successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



module.exports = { getMyProfile, updateMyProfile  };
