import React, { useEffect, useState } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";

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

  return (
    <div>
      <h2>My Timesheets</h2>

      <Link to="/employee/timesheet">
        <button>Submit New Timesheet</button>
      </Link>

      <br /><br />

      {timesheets.length === 0 ? (
        <p>No timesheets submitted</p>
      ) : (
        <table border="1" cellPadding="6">
          <thead>
            <tr>
              <th>Week</th>
              <th>Total Hours</th>
              <th>Status</th>
              <th>Manager Comment</th>
              <th>Action Date</th>
            </tr>
          </thead>

          <tbody>
            {timesheets.map(ts => (
              <tr key={ts.timesheet_id}>
                <td>
                  {formatSqlDate(ts.week_start_date)} –{" "}
                  {formatSqlDate(ts.week_end_date)}
                </td>
                <td>{ts.total_hours}</td>
                <td>{ts.status}</td>
                <td>{ts.comments || "—"}</td>
                <td>{formatSqlDate(ts.action_date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EmployeeDashboard;