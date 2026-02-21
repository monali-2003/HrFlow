import React, { useEffect, useState } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = () => {
    api.get("/admin/").then(res => {
      setEmployees(res.data.employees);
    });
  };

  return (
    <div>
      <h2>Admin – Employee Management</h2>
      <Link to="/admin/addEmployee"> AddEmployee </Link>
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Designation</th>
            <th>Salary</th>
            <th>Role</th>
            <th>Department</th>
<th> Manager </th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {employees.map(e => (
            <tr key={e.employee_id}>
              <td>{e.full_name}</td>
              <td>{e.email}</td>
              <td>{e.designation}</td>
              <td>{e.salary}</td>
              
<td>{e.role_id}</td>
              <td>{e.department_id}</td>
              <td>{e.manager_id}</td>
              
              <td>{e.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
