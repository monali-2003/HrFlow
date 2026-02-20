import React, { useEffect, useState } from "react";
import api from "../api/api";

const AddEmployee = () => {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    role_id: "",
    department_id: "",
    manager_id: "",
    designation: "",
    salary: ""
  });

  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [managers, setManagers] = useState([]);
  const [message, setMessage] = useState("");

  /* ---------------- Load dropdown data ---------------- */
  useEffect(() => {
    api.get("/common/roles").then(res => setRoles(res.data.roles));
    api.get("/common/departments").then(res => setDepartments(res.data.departments));
    api.get("/common/managers").then(res => setManagers(res.data.managers));
  }, []);

  /* ---------------- Handle input ---------------- */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ---------------- Submit form ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await api.post("/admin/add", {
        ...form,
        salary: Number(form.salary)
      });

      setMessage("✅ Employee added successfully");

      setForm({
        full_name: "",
        email: "",
        password: "",
        role_id: "",
        department_id: "",
        manager_id: "",
        designation: "",
        salary: ""
      });

    } catch (err) {
      setMessage(err.response?.data?.error || "❌ Failed to add employee");
    }
  };

  return (
    <div>
      <h2>Add Employee</h2>

      {message && <p aria-live="polite">{message}</p>}

      <form onSubmit={handleSubmit}>
        <label>
          Full Name
          <input
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            required
          />
        </label>

        <br />

        <label>
          Email
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>

        <br />

        <label>
          Password
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>

        <br />

        <label>
          Role
          <select
            name="role_id"
            value={form.role_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Role</option>
            {roles.map(r => (
              <option key={r.role_id} value={r.role_id}>
                {r.role_name}
              </option>
            ))}
          </select>
        </label>

        <br />

        <label>
          Department
          <select
            name="department_id"
            value={form.department_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Department</option>
            {departments.map(d => (
              <option key={d.department_id} value={d.department_id}>
                {d.department_name}
              </option>
            ))}
          </select>
        </label>

        <br />

        <label>
          Manager (optional)
          <select
            name="manager_id"
            value={form.manager_id}
            onChange={handleChange}
          >
            <option value="">None</option>
            {managers.map(m => (
              <option key={m.employee_id} value={m.employee_id}>
                {m.full_name}
              </option>
            ))}
          </select>
        </label>

        <br />

        <label>
          Designation
          <input
            name="designation"
            value={form.designation}
            onChange={handleChange}
            required
          />
        </label>

        <br />

        <label>
          Salary
          <input
            name="salary"
            type="number"
            value={form.salary}
            onChange={handleChange}
            required
          />
        </label>

        <br /><br />

        <button type="submit">Add Employee</button>
      </form>
    </div>
  );
};

export default AddEmployee;
