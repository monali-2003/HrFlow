import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";

const AdminEmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState({
    full_name: "",
    email: "",
    role_id: "",
    department_id: "",
    manager_id: "",
    designation: "",
    salary: "",
    is_active: 1,
    phone: "",
    address: "",
    dob: "",
    emergency_contact: ""
  });

  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [managers, setManagers] = useState([]);

  const loadData = useCallback(async () => {
    try {
      const empRes = await api.get(`/admin/profile/employee/${id}`);
      const rolesRes = await api.get("/common/roles");
      const deptRes = await api.get("/common/departments");
      const mgrRes = await api.get("/common/managers");

      setEmployee(empRes.data.employee || {});
      setRoles(rolesRes.data.roles || []);
      setDepartments(deptRes.data.departments || []);
      setManagers(mgrRes.data.managers || []);
    } catch (err) {
      alert("Failed to load data");
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      await api.put(`/admin/profile/employee/${id}`, employee);
      alert("Employee updated successfully");
      navigate("/admin");
    } catch (err) {
      alert("Update failed");
    }
  };

  /* ===================== STYLES ===================== */

  const pageStyle = {
    minHeight: "100vh",
    backgroundColor: "#f4f6f9",
    padding: "30px",
    fontFamily: "Arial, sans-serif"
  };

  const sectionStyle = {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
    marginBottom: "25px"
  };

  const sectionTitle = {
    marginBottom: "20px",
    color: "#4e73df"
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

  const saveBtn = {
    padding: "10px 20px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold"
  };

  const cancelBtn = {
    padding: "10px 20px",
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "6px",
    marginLeft: "10px",
    cursor: "pointer"
  };

  /* ===================== UI ===================== */

  return (
    <div style={pageStyle}>
      <h2 style={{ marginBottom: "25px", color: "#2c3e50" }}>
        Admin – Edit Employee Profile
      </h2>

      {/* WORK DETAILS */}
      <div style={sectionStyle}>
        <h3 style={sectionTitle}>Work Details</h3>

        <div style={rowStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Employee ID</label>
            <input value={employee.employee_id || ""} disabled style={inputStyle} />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Employee Name</label>
            <input
              name="full_name"
              value={employee.full_name}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Email</label>
            <input
              name="email"
              value={employee.email}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
        </div>

        <div style={rowStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Role</label>
            <select name="role_id" value={employee.role_id} onChange={handleChange} style={inputStyle}>
              <option value="">Select Role</option>
              {roles.map((r) => (
                <option key={r.role_id} value={r.role_id}>
                  {r.role_name}
                </option>
              ))}
            </select>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Department</label>
            <select name="department_id" value={employee.department_id} onChange={handleChange} style={inputStyle}>
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d.department_id} value={d.department_id}>
                  {d.department_name}
                </option>
              ))}
            </select>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>ManagerId</label>
            <select name="manager_id" value={employee.manager_id || ""} onChange={handleChange} style={inputStyle}>
              <option value="">None</option>
              {managers.map((m) => (
                <option key={m.employee_id} value={m.employee_id}>
                  {m.full_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={rowStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Designation</label>
            <input
              name="designation"
              value={employee.designation}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Salary</label>
            <input
              name="salary"
              value={employee.salary}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Status</label>
            <select name="is_active" value={employee.is_active} onChange={handleChange} style={inputStyle}>
              <option value={1}>Active</option>
              <option value={0}>Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* PERSONAL DETAILS */}
      <div style={sectionStyle}>
        <h3 style={sectionTitle}>Personal Details</h3>

        <div style={rowStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Phone</label>
            <input name="phone" value={employee.phone} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Location</label>
            <input name="address" value={employee.address} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Date of Birth</label>
            <input type="date" name="dob" value={employee.dob} onChange={handleChange} style={inputStyle} />
          </div>
        </div>

        <div style={rowStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Emergency Contact</label>
            <input
              name="emergency_contact"
              value={employee.emergency_contact}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
        </div>
      </div>

      <div>
        <button onClick={handleSave} style={saveBtn}>
          Save Changes
        </button>

        <button onClick={() => navigate("/admin")} style={cancelBtn}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AdminEmployeeProfile;