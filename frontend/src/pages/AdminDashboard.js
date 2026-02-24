import React, { useEffect, useState } from "react";
import api from "../api/api";
import AdminDeleteEmployee from "./adminDeleteEmployee";
import { Link } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
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
<LogoutButton/>
      <h2>Admin – Employee Management</h2>
      <Link to="/admin/addEmployee"> AddEmployee </Link>
      <AdminDeleteEmployee onDeleteSuccess={loadEmployees} />
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
<th> Action </th>
          </tr>
        </thead>

        <tbody>
          {employees.map(e => (
            <tr key={e.employee_id}>
              <td>{e.full_name}</td>
              <td>{e.email}</td>
              <td>{e.designation}</td>
              <td>{e.salary}</td>
              
<td>{e.role_name}</td>
              <td>{e.department_name}</td>
              <td>{e.manager_id}</td>
              
              <td>{e.status}</td>
      <td>
        <Link to={`/admin/employee/${e.employee_id}`}>
          <button>View / Edit</button>
        </Link>
      </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
