import React, { useState, useMemo } from "react";
import api from "../api/api";

/* ---------- Helpers ---------- */

const days = [
  { name: "Monday", isWeekend: false },
  { name: "Tuesday", isWeekend: false },
  { name: "Wednesday", isWeekend: false },
  { name: "Thursday", isWeekend: false },
  { name: "Friday", isWeekend: false },
  { name: "Saturday", isWeekend: true },
  { name: "Sunday", isWeekend: true }
];

const formatLabel = (startStr) => {
  const [y, m, d] = startStr.split("-").map(Number);
  const start = new Date(y, m - 1, d);
  const end = new Date(y, m - 1, d + 6);

  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const fmt = (dt) =>
    `${String(dt.getDate()).padStart(2,"0")}/${months[dt.getMonth()]}/${dt.getFullYear()}`;

  return `${fmt(start)} – ${fmt(end)}`;
};

const getWeeksForRange = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const targetMonths = [month - 1, month, month + 1];
  const weeks = [];

  targetMonths.forEach(m => {
    const first = new Date(year, m, 1);
    const last = new Date(year, m + 1, 0);

    for (let d = new Date(first); d <= last; d.setDate(d.getDate() + 1)) {
      if (d.getDay() === 1) {
        const y = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        const startStr = `${y}-${mm}-${dd}`;

        weeks.push({
          start: startStr,
          label: formatLabel(startStr)
        });
      }
    }
  });

  return weeks;
};

const getDateForDay = (weekStart, index) => {
  const [y, m, d] = weekStart.split("-").map(Number);
  const date = new Date(y, m - 1, d + index);

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`;
};

const TimesheetForm = () => {
  const weeks = getWeeksForRange();
  const [selectedWeek, setSelectedWeek] = useState("");

  const [rows, setRows] = useState(
    days.map(d => ({
      day: d.name,
      hours: "",
      type: d.isWeekend ? "Weekend" : "Working Day",
      isWeekend: d.isWeekend
    }))
  );

  const handleChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  const totalHours = useMemo(() => {
    return rows.reduce((sum, r) => {
      if (!r.isWeekend && r.type === "Working Day") {
        return sum + Number(r.hours || 0);
      }
      return sum;
    }, 0);
  }, [rows]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedWeek) {
      alert("Please select a week");
      return;
    }

    const entries = rows.map((r, i) => ({
      work_date: getDateForDay(selectedWeek, i),
      hours_worked:
        !r.isWeekend && r.type === "Working Day"
          ? Number(r.hours || 0)
          : 0,
      task_description: r.type
    }));

    await api.post("/timesheets/submit", {
      week_start_date: selectedWeek,
      entries
    });

    alert("Timesheet submitted successfully");
  };

  /* ================= STYLES ================= */

  const pageStyle = {
    minHeight: "100vh",
    backgroundColor: "#f4f6f9",
    padding: "30px",
    fontFamily: "Arial, sans-serif"
  };

  const cardStyle = {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    marginBottom: "25px"
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse"
  };

  const thStyle = {
    backgroundColor: "#4e73df",
    color: "#ffffff",
    padding: "12px",
    textAlign: "left",
    fontWeight: "bold"
  };

  const tdStyle = {
    padding: "10px",
    borderBottom: "1px solid #e0e0e0",
    color: "#2c3e50",
    fontSize: "14px"
  };

  const radioStyle = {
    appearance: "auto",
    width: "18px",
    height: "18px",
    marginRight: "8px"
  };

  const buttonStyle = {
    padding: "8px 20px",
    backgroundColor: "#28a745",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold"
  };

  return (
    <form onSubmit={handleSubmit} style={pageStyle}>
      <h2 style={{ color: "#2c3e50", marginBottom: "20px" }}>
        Weekly Timesheet
      </h2>

      {/* WEEK SELECTION */}
      <div style={cardStyle}>
        <h3 style={{ color: "#4e73df", marginBottom: "15px" }}>
          Select Week
        </h3>

        {weeks.map(w => (
          <label key={w.start} style={{ display: "block", marginBottom: "8px", color: "#2c3e50" }}>
            <input
              type="radio"
              name="week"
              value={w.start}
              onChange={() => setSelectedWeek(w.start)}
              style={radioStyle}
            />
            {w.label}
          </label>
        ))}
      </div>

      {/* TABLE */}
      <div style={cardStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Day</th>
              <th style={thStyle}>Work Hours</th>
              <th style={thStyle}>Day Type</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={row.day}
                style={{
                  backgroundColor: row.isWeekend
                    ? "#f8f9fa"
                    : index % 2 === 0
                    ? "#ffffff"
                    : "#f2f2f2"
                }}
              >
                <td style={tdStyle}>{row.day}</td>
                <td style={tdStyle}>
                  <input
                    type="number"
                    min="0"
                    max="12"
                    value={row.hours}
                    onChange={e => handleChange(index, "hours", e.target.value)}
                  />
                </td>
                <td style={tdStyle}>
                  <select
                    value={row.type}
                    onChange={e => handleChange(index, "type", e.target.value)}
                  >
                    {row.isWeekend ? (
                      <option>Weekend</option>
                    ) : (
                      <>
                        <option>Working Day</option>
                        <option>Public Holiday</option>
                        <option>Leave</option>
                        <option>Sick Leave</option>
                      </>
                    )}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: "15px", fontWeight: "bold", color: "#2c3e50" }}>
          Total Working Hours:
          <input
            type="number"
            value={totalHours}
            readOnly
            style={{ marginLeft: "10px", width: "70px" }}
          />
        </div>
      </div>

      <button type="submit" style={buttonStyle}>
        Submit Timesheet
      </button>
    </form>
  );
};

export default TimesheetForm;