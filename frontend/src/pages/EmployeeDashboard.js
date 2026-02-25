import React, { useEffect, useState } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";

/* Safe formatter – NO timezone */
const formatSqlDate = (sqlDate) => {
  if (!sqlDate) return "—";

  const [year, month, day] = sqlDate.split("-");
  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  return `${day}/${months[Number(month) - 1]}/${year}`;
};

const EmployeeDashboard = () => {
  const [timesheets, setTimesheets] = useState([]);

  useEffect(() => {
    api.get("/timesheets/my")
      .then(res => {
        setTimesheets(res.data.my_timesheets);
      })
      .catch(() => {
        alert("Failed to load timesheets");
      });
  }, []);

  /* ================= STYLES ================= */

  const pageStyle = {
    minHeight: "100vh",
    backgroundColor: "#f4f6f9",
    padding: "30px",
    fontFamily: "Arial, sans-serif"
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px"
  };

  const rightButtonGroup = {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  };

  const cardStyle = {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
  };

  const profileBtnStyle = {
    padding: "8px 14px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold"
  };

  const smallButtonStyle = {
    padding: "6px 12px",
    backgroundColor: "#4e73df",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "13px"
  };

  const thStyle = {
    padding: "12px",
    color: "white",
    textAlign: "left"
  };

  const tdStyle = {
    padding: "10px",
    color: "#2c3e50"
  };

  /* ================= UI ================= */

  return (
    <div style={pageStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h1 style={{ color: "#2c3e50", margin: 0 }}>
          Employee Dashboard
        </h1>

        {/* ✅ Button Group */}
        <div style={rightButtonGroup}>
          <Link to="/employee/profile">
            <button style={profileBtnStyle}>
              View / Edit Profile
            </button>
          </Link>

          <LogoutButton />
        </div>
      </div>

      {/* My Timesheets Heading */}
      <h2
        style={{
          marginBottom: "20px",
          color: "#4e73df",
          fontSize: "28px",
          fontWeight: "bold"
        }}
      >
        My Timesheets
      </h2>

      {/* Submit Button */}
      <div style={{ marginBottom: "20px" }}>
        <Link to="/employee/timesheet">
          <button style={smallButtonStyle}>
            + Submit New Timesheet
          </button>
        </Link>
      </div>

      {/* Table Card */}
      <div style={cardStyle}>
        {timesheets.length === 0 ? (
          <p style={{ color: "#6c757d" }}>
            No timesheets submitted
          </p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse"
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#4e73df" }}>
                <th style={thStyle}>Week</th>
                <th style={thStyle}>Total Hours</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Manager Comment</th>
                <th style={thStyle}>Action Date</th>
              </tr>
            </thead>

            <tbody>
              {timesheets.map((ts, index) => (
                <tr
                  key={ts.timesheet_id}
                  style={{
                    backgroundColor:
                      index % 2 === 0 ? "#f9f9f9" : "white"
                  }}
                >
                  <td style={tdStyle}>
                    {formatSqlDate(ts.week_start_date)} –{" "}
                    {formatSqlDate(ts.week_end_date)}
                  </td>
                  <td style={tdStyle}>{ts.total_hours}</td>
                  <td style={tdStyle}>{ts.status}</td>
                  <td style={tdStyle}>{ts.comments || "—"}</td>
                  <td style={tdStyle}>
                    {formatSqlDate(ts.action_date)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;