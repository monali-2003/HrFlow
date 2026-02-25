import React, { useEffect, useState } from "react";
import api from "../api/api";

const EmployeeProfile = () => {
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/employee/profile");
        setProfile(res.data.profile || res.data);
      } catch (err) {
        setMessage("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        phone: profile.phone,
        address: profile.address,
        date_of_birth: profile.date_of_birth || null,
        emergency_contact: profile.emergency_contact,
        gender: profile.gender,
        blood_group: profile.blood_group
      };

      await api.put("/employee/profile", payload);
      setMessage("Profile updated successfully");
    } catch (err) {
      setMessage("Failed to update profile");
    }
  };

  if (loading) return <p>Loading profile…</p>;
  if (!profile) return <p>No profile data found</p>;

  /* ===================== STYLES ===================== */

  const pageStyle = {
    minHeight: "100vh",
    backgroundColor: "#f4f6f9",
    padding: "30px",
    fontFamily: "Arial, sans-serif"
  };

  const sectionStyle = {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
    marginBottom: "25px"
  };

  const rowStyle = {
    display: "flex",
    gap: "20px",
    marginBottom: "20px"
  };

  const fieldStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column"
  };

  const labelStyle = {
    marginBottom: "6px",
    fontWeight: "bold",
    color: "#2c3e50"
  };

  const valueStyle = {
    padding: "8px",
    backgroundColor: "#f8f9fa",
    borderRadius: "6px",
    border: "1px solid #ddd"
  };

  const inputStyle = {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  };

  const buttonStyle = {
    padding: "10px 20px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold"
  };

  return (
    <div style={pageStyle}>
      <h2 style={{ marginBottom: "25px", color: "#2c3e50" }}>
        My Profile
      </h2>

      {message && (
        <div style={{ marginBottom: "15px", color: "#28a745" }}>
          {message}
        </div>
      )}

      {/* WORK DETAILS */}
      <div style={sectionStyle}>
        <h3 style={{ marginBottom: "20px", color: "#4e73df" }}>
          Work Information
        </h3>

        <div style={rowStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Employee ID</label>
            <div style={valueStyle}>{profile.employee_id}</div>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Employee Name</label>
            <div style={valueStyle}>{profile.full_name}</div>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Email ID</label>
            <div style={valueStyle}>{profile.email}</div>
          </div>
        </div>

        <div style={rowStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Designation</label>
            <div style={valueStyle}>{profile.designation}</div>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Monthly Salary</label>
            <div style={valueStyle}>₹ {profile.salary}</div>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Department Name</label>
            <div style={valueStyle}>{profile.department_name}</div>
          </div>
        </div>

        <div style={rowStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Role</label>
            <div style={valueStyle}>{profile.role_name}</div>
          </div>
        </div>
      </div>

      {/* PERSONAL DETAILS */}
      <form onSubmit={handleSubmit} style={sectionStyle}>
        <h3 style={{ marginBottom: "20px", color: "#4e73df" }}>
          Personal Information
        </h3>

        <div style={rowStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Phone Number</label>
            <input
              name="phone"
              value={profile.phone || ""}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Gender</label>
            <select
              name="gender"
              value={profile.gender || ""}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Blood Group</label>
            <input
              name="blood_group"
              value={profile.blood_group || ""}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
        </div>

        <div style={rowStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Date of Birth</label>
            <input
              type="date"
              name="date_of_birth"
              value={profile.date_of_birth?.split("T")[0] || ""}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Emergency Contact Number</label>
            <input
              name="emergency_contact"
              value={profile.emergency_contact || ""}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Location</label>
            <textarea
              name="address"
              value={profile.address || ""}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
        </div>

        <button type="submit" style={buttonStyle}>
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EmployeeProfile;