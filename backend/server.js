const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const employeeRoutes = require("./routes/employeeRoutes");
const authRoutes = require("./routes/authRoutes");
const timesheetRoutes = require("./routes/timesheetRoutes");
const employeeProfileRoutes= require("./routes/employeeProfileRoutes");
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
app.use("/api/admin/manage", adminDeleteRoutes);// Test route
app.get("/", (req, res) => {
  res.send("HR Portal Backend is running 🚀");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
