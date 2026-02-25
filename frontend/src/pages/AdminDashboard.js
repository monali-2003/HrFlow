import React, { useEffect, useState } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";

const AdminDashboard = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = () => {
    api.get("/admin/").then((res) => {
      setEmployees(res.data.employees);
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f4f6f9",
        padding: "30px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
        }}
      >
        <h2 style={{ color: "#2c3e50" }}>
          Admin Dashboard – Employee Management
        </h2>
        <LogoutButton />
      </div>

      {/* Add Employee Button (Above Table - Left Side) */}
      <div style={{ marginBottom: "20px" }}>
        <Link to="/admin/addEmployee">
          <button
            style={{
              padding: "10px 18px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            + Add Employee
          </button>
        </Link>
      </div>

      {/* Table Container */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "10px",
          padding: "20px",
          boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
          overflowX: "auto",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#4e73df" }}>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Designation</th>
              <th style={thStyle}>Salary</th>
              <th style={thStyle}>Role</th>
              <th style={thStyle}>Department</th>
              <th style={thStyle}>Manager</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((e, index) => (
              <tr
                key={e.employee_id}
                style={{
                  backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff",
                }}
              >
                <td style={tdStyle}>{e.full_name}</td>
                <td style={tdStyle}>{e.email}</td>
                <td style={tdStyle}>{e.designation}</td>
                <td style={tdStyle}>₹ {e.salary}</td>
                <td style={tdStyle}>{e.role_name}</td>
                <td style={tdStyle}>{e.department_name}</td>
                <td style={tdStyle}>{e.manager_id}</td>
                <td style={tdStyle}>{e.status}</td>
                <td style={tdStyle}>
                  <Link to={`/admin/employee/${e.employee_id}`}>
                    <button
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      View / Edit
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Remove Employee Button */}
      <div style={{ marginTop: "20px" }}>
        <Link to="/admin/removeEmployee">
          <button
            style={{
              padding: "10px 18px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Remove Employee
          </button>
        </Link>
      </div>
    </div>
  );
};

// Header Style
const thStyle = {
  padding: "12px",
  fontSize: "14px",
  color: "white",
  textAlign: "left",
};

// Data Style (FIXED TEXT COLOR HERE)
const tdStyle = {
  padding: "10px",
  fontSize: "14px",
  color: "#2c3e50",   // ✅ Proper dark text color
  textAlign: "left",
};

export default AdminDashboard;