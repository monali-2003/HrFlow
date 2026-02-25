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

  // ✅ useCallback to fix CI ESLint issue
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
      console.error("Load error:", err);
      alert("Failed to load data");
    }
  }, [id]);

  // ✅ Correct dependency
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
      console.error("Update error:", err);
      alert("Update failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin – Edit Employee Profile</h2>

      {/* WORK DETAILS */}
      <fieldset>
        <legend>Work Details</legend>

        <label>Employee ID:</label>
        <input value={employee.employee_id || ""} disabled />
        <br />

        <label>Name:</label>
        <input name="full_name" value={employee.full_name} onChange={handleChange} />
        <br />

        <label>Email:</label>
        <input name="email" value={employee.email} onChange={handleChange} />
        <br />

        <label>Role:</label>
        <select name="role_id" value={employee.role_id} onChange={handleChange}>
          <option value="">Select Role</option>
          {roles.map((r) => (
            <option key={r.role_id} value={r.role_id}>
              {r.role_name}
            </option>
          ))}
        </select>
        <br />

        <label>Department:</label>
        <select name="department_id" value={employee.department_id} onChange={handleChange}>
          <option value="">Select Department</option>
          {departments.map((d) => (
            <option key={d.department_id} value={d.department_id}>
              {d.department_name}
            </option>
          ))}
        </select>
        <br />

        <label>Manager:</label>
        <select name="manager_id" value={employee.manager_id || ""} onChange={handleChange}>
          <option value="">None</option>
          {managers.map((m) => (
            <option key={m.employee_id} value={m.employee_id}>
              {m.full_name}
            </option>
          ))}
        </select>
        <br />

        <label>Designation:</label>
        <input name="designation" value={employee.designation} onChange={handleChange} />
        <br />

        <label>Salary:</label>
        <input name="salary" value={employee.salary} onChange={handleChange} />
        <br />

        <label>Status:</label>
        <select name="is_active" value={employee.is_active} onChange={handleChange}>
          <option value={1}>Active</option>
          <option value={0}>Inactive</option>
        </select>
      </fieldset>

      <br />

      {/* PERSONAL DETAILS */}
      <fieldset>
        <legend>Personal Details</legend>

        <label>Phone:</label>
        <input name="phone" value={employee.phone} onChange={handleChange} />
        <br />

        <label>Address:</label>
        <input name="address" value={employee.address} onChange={handleChange} />
        <br />

        <label>Date of Birth:</label>
        <input type="date" name="dob" value={employee.dob} onChange={handleChange} />
        <br />

        <label>Emergency Contact:</label>
        <input name="emergency_contact" value={employee.emergency_contact} onChange={handleChange} />
      </fieldset>

      <br />

      <button onClick={handleSave}>Save Changes</button>
      <button onClick={() => navigate("/admin")} style={{ marginLeft: "10px" }}>
        Cancel
      </button>
    </div>
  );
};

export default AdminEmployeeProfile;