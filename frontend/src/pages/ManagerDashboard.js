import React, { useEffect, useState } from "react";
import api from "../api/api";

const ManagerDashboard = () => {
  const [pending, setPending] = useState([]);

  useEffect(() => {
    api.get("/timesheets/manager/pending").then(res => {
      setPending(res.data.pending_timesheets);
    });
  }, []);

  return (
    <div>
      <h2>Pending Timesheets</h2>
      {pending.map(t => (
        <div key={t.timesheet_id}>
          {t.employee_name} - {t.week_start_date}
        </div>
      ))}
    </div>
  );
};

export default ManagerDashboard;
