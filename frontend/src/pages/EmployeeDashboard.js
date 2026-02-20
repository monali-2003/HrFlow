import React, { useEffect, useState } from "react";
import api from "../api/api";

const EmployeeDashboard = () => {
  const [timesheets, setTimesheets] = useState([]);

  useEffect(() => {
    api.get("/timesheets/my").then(res => {
      setTimesheets(res.data.my_timesheets);
    });
  }, []);

  return (
    <div>
      <h2>My Timesheets</h2>
      {timesheets.map(t => (
        <div key={t.timesheet_id}>
          {t.week_start_date} - {t.status}
        </div>
      ))}
    </div>
  );
};

export default EmployeeDashboard;
