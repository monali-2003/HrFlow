import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import EmployeeProfile from "./pages/EmployeeProfile";

import TimesheetForm from "./pages/TimesheetForm";
import ManagerDashboard from "./pages/ManagerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AddEmployee from "./pages/AddEmployee";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/employee" element={
          <ProtectedRoute role="Employee">
            <EmployeeDashboard />
          </ProtectedRoute>
        } />
        <Route path="/employee/profile" element={
          <ProtectedRoute role="Employee">
            <EmployeeProfile />
          </ProtectedRoute>
        } />

<Route
  path="/employee/timesheet"
  element={
    <ProtectedRoute role="Employee">
      <TimesheetForm />
    </ProtectedRoute>
  }
/>
        <Route path="/manager" element={
          <ProtectedRoute role="Manager">
            <ManagerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/manager/profile" element={
          <ProtectedRoute role="Manager">
            <EmployeeProfile  />
          </ProtectedRoute>
        } />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="Admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/addEmployee"
          element={
            <ProtectedRoute role="Admin">
              <AddEmployee />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
