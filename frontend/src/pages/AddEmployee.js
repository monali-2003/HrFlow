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

  useEffect(() => {
    api.get("/common/roles").then(res => setRoles(res.data.roles));
    api.get("/common/departments").then(res => setDepartments(res.data.departments));
    api.get("/common/managers").then(res => setManagers(res.data.managers));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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

  /* ===================== STYLES ===================== */

  const pageStyle = {
    minHeight: "100vh",
    backgroundColor: "#f4f6f9",
    padding: "30px",
    fontFamily: "Arial, sans-serif"
  };

  const cardStyle = {
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "10px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
  };

  const rowStyle = {
    display: "flex",
    gap: "20px",
    marginBottom: "20px"
  };

  const fieldStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column"
  };

  const labelStyle = {
    marginBottom: "6px",
    fontWeight: "bold",
    color: "#2c3e50"
  };

  const inputStyle = {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px"
  };

  const buttonStyle = {
    padding: "10px 20px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold"
  };

  return (
    <div style={pageStyle}>
      <h2 style={{ marginBottom: "25px", color: "#2c3e50" }}>
        Add New Employee
      </h2>

      {message && (
        <div style={{ marginBottom: "15px", color: "#28a745" }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} style={cardStyle}>

        {/* Row 1 */}
        <div style={rowStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Employee Name</label>
            <input
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Email Id</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>
        </div>

        {/* Row 2 */}
        <div style={rowStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Role</label>
            <select
              name="role_id"
              value={form.role_id}
              onChange={handleChange}
              style={inputStyle}
              required
            >
              <option value="">Select Role</option>
              {roles.map(r => (
                <option key={r.role_id} value={r.role_id}>
                  {r.role_name}
                </option>
              ))}
            </select>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Department</label>
            <select
              name="department_id"
              value={form.department_id}
              onChange={handleChange}
              style={inputStyle}
              required
            >
              <option value="">Select Department</option>
              {departments.map(d => (
                <option key={d.department_id} value={d.department_id}>
                  {d.department_name}
                </option>
              ))}
            </select>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Manager</label>
            <select
              name="manager_id"
              value={form.manager_id}
              onChange={handleChange}
              style={inputStyle}
              required
            >
              <option value="">Select Manager</option>
              {managers.map(m => (
                <option key={m.employee_id} value={m.employee_id}>
                  {m.full_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 3 */}
        <div style={rowStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Designation</label>
            <input
              name="designation"
              value={form.designation}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Salary</label>
            <input
              name="salary"
              type="number"
              value={form.salary}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>
        </div>

        <button type="submit" style={buttonStyle}>
          Add Employee
        </button>

      </form>
    </div>
  );
};

export default AddEmployee;