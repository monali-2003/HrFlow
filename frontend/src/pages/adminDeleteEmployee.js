import React, { useState } from "react";
import api from "../api/api";

const AdminDeleteEmployee = ({ onDeleteSuccess }) => {
  const [employeeId, setEmployeeId] = useState("");
  const [email, setEmail] = useState("");

  const handleDelete = async () => {
    if (!employeeId || !email) {
      alert("Please enter Employee ID and Email");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to permanently remove this employee?"
    );

    if (!confirmDelete) return;

    try {
await api.put(`/admin/manage/employee/${employeeId}/deactivate`, {
  email
});
      alert("Employee removed successfully");

      setEmployeeId("");
      setEmail("");

      if (onDeleteSuccess) {
        onDeleteSuccess(); // reload employees
      }

    } catch (err) {
      alert(err.response?.data?.message || "Failed to remove employee");
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Remove Employee</h3>

      <label>
        Employee ID:
        <input
          type="number"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          style={{ marginLeft: "10px" }}
        />
      </label>

      <br /><br />

      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginLeft: "10px" }}
        />
      </label>

      <br /><br />

      <button onClick={handleDelete}>
        Remove Employee
      </button>
    </div>
  );
};
export default AdminDeleteEmployee;