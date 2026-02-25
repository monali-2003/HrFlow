const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
const employeeRoutes = require("./routes/employeeRoutes");
const authRoutes = require("./routes/authRoutes");
const timesheetRoutes = require("./routes/timesheetRoutes");
const employeeProfileRoutes = require("./routes/employeeProfileRoutes");
const adminRoutes = require("./routes/adminRoutes");
const commonRoutes = require("./routes/commonRoutes");
const adminProfileRoutes = require("./routes/adminProfileRoutes");
const adminDeleteRoutes = require("./routes/adminDeleteRoutes");

app.use("/api/employees", employeeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/timesheets", timesheetRoutes);
app.use("/api/employee", employeeProfileRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/common", commonRoutes);
app.use("/api/admin/profile", adminProfileRoutes);
app.use("/api/admin/manage", adminDeleteRoutes);

// Serve React build
app.use(express.static(path.join(__dirname, "public")));

// React routing support

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});