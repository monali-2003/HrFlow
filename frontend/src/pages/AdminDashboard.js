import React, { useEffect, useState } from "react";
import api from "../api/api";
import AddEmployee from "./AddEmployee";
const AdminDashboard = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = () => {
    api.get("/admin/employees").then(res => {
      setEmployees(res.data.employees);
    });
  };

  return (
    <div>
      <h2>Admin – Employee Management</h2>
      <AddEmployee />
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Salary</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {employees.map(emp => (
            <tr key={emp.employee_id}>
              <td>{emp.full_name}</td>
              <td>{emp.email}</td>
              <td>{emp.designation}</td>
              <td>{emp.salary}</td>
              
<td>{emp.role_id}</td>
              <td>{emp.department_id}</td>

              <td>{emp.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
