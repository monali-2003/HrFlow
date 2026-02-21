import React, { useEffect, useState } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";

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
      loadPending(); // refresh table

    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    }
  };

  return (
    <div>
<h1> Manager Dashboard </h1>
<Link to="/manager/profile"> View/EditProfile </Link>
      <h2>Pending Timesheets (Manager)</h2>

      {pending.length === 0 ? (
        <p>No pending timesheets</p>
      ) : (
        <table border="1" cellPadding="6">
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Week Start</th>
              <th>Total Hours</th>
              <th>Status</th>
              <th>Manager Comment</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {pending.map(ts => (
              <tr key={ts.timesheet_id}>
                <td>{ts.employee_name}</td>
                <td>{ts.week_start_date}</td>
                <td>{ts.total_hours}</td>
                <td>{ts.status}</td>

                <td>
                  <label>
                    <span className="sr-only">
                      Comment for {ts.employee_name}
                    </span>
                    <input
                      type="text"
                      value={comments[ts.timesheet_id] || ""}
                      onChange={e =>
                        handleCommentChange(ts.timesheet_id, e.target.value)
                      }
                    />
                  </label>
                </td>

                <td>
                  <button
                    onClick={() =>
                      handleAction(ts.timesheet_id, "Approved")
                    }
                  >
                    Approve
                  </button>

                  <button
                    onClick={() =>
                      handleAction(ts.timesheet_id, "Rejected")
                    }
                    style={{ marginLeft: "6px" }}
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
  );
};

export default ManagerDashboard;