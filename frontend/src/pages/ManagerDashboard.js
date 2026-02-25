import React, { useEffect, useState } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";

const ManagerDashboard = () => {
  const [pending, setPending] = useState([]);
  const [comments, setComments] = useState({});

  const loadPending = () => {
    api.get("/timesheets/manager/pending")
      .then(res => {
        setPending(res.data.pending_timesheets);
      })
      .catch(() => {
        alert("Failed to load pending timesheets");
      });
  };

  useEffect(() => {
    loadPending();
  }, []);

  const handleCommentChange = (timesheetId, value) => {
    setComments(prev => ({
      ...prev,
      [timesheetId]: value
    }));
  };

  const handleAction = async (timesheetId, action) => {
    try {
      await api.put("/timesheets/approve-reject", {
        timesheet_id: timesheetId,
        action,
        comments: comments[timesheetId] || ""
      });

      alert(`Timesheet ${action.toLowerCase()} successfully`);
      loadPending();

    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    }
  };

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

  /* ✅ Group Buttons */
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
    backgroundColor: "#4e73df",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold"
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse"
  };

  const thStyle = {
    padding: "12px",
    backgroundColor: "#4e73df",
    color: "white",
    textAlign: "left"
  };

  const tdStyle = {
    padding: "10px",
    borderBottom: "1px solid #e0e0e0",
    color: "#2c3e50"
  };

  const inputStyle = {
    padding: "6px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    width: "100%"
  };

  const approveBtn = {
    padding: "6px 12px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "13px"
  };

  const rejectBtn = {
    padding: "6px 12px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "13px",
    marginLeft: "6px"
  };

  return (
    <div style={pageStyle}>

      {/* Header */}
      <div style={headerStyle}>
        <h1 style={{ color: "#2c3e50", margin: 0 }}>
          Manager Dashboard
        </h1>

        {/* ✅ Buttons grouped properly */}
        <div style={rightButtonGroup}>
          <Link to="/manager/profile">
            <button style={profileBtnStyle}>
              View / Edit Profile
            </button>
          </Link>

          <LogoutButton />
        </div>
      </div>

      <h2 style={{ color: "#4e73df", marginBottom: "20px" }}>
        Pending Timesheets
      </h2>

      <div style={cardStyle}>
        {pending.length === 0 ? (
          <p style={{ color: "#6c757d" }}>
            No pending timesheets
          </p>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Employee Name</th>
                <th style={thStyle}>Week Start</th>
                <th style={thStyle}>Total Hours</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Manager Comment</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {pending.map((ts, index) => (
                <tr
                  key={ts.timesheet_id}
                  style={{
                    backgroundColor:
                      index % 2 === 0 ? "#f9f9f9" : "white"
                  }}
                >
                  <td style={tdStyle}>{ts.employee_name}</td>
                  <td style={tdStyle}>{ts.week_start_date}</td>
                  <td style={tdStyle}>{ts.total_hours}</td>
                  <td style={tdStyle}>{ts.status}</td>

                  <td style={tdStyle}>
                    <input
                      type="text"
                      placeholder="Enter comment"
                      value={comments[ts.timesheet_id] || ""}
                      onChange={e =>
                        handleCommentChange(ts.timesheet_id, e.target.value)
                      }
                      style={inputStyle}
                    />
                  </td>

                  <td style={tdStyle}>
                    <button
                      onClick={() =>
                        handleAction(ts.timesheet_id, "Approved")
                      }
                      style={approveBtn}
                    >
                      Approve
                    </button>

                    <button
                      onClick={() =>
                        handleAction(ts.timesheet_id, "Rejected")
                      }
                      style={rejectBtn}
                    >
                      Reject
                    </button>
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

export default ManagerDashboard;