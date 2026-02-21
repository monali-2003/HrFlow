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

        console.log("Profile data:", res.data);

        setProfile(res.data.profile || res.data);
      } catch (err) {
        console.error("Profile fetch error:", err);
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

    console.log("Sending payload:", payload);

    await api.put("/employee/profile", payload);

    setMessage("Profile updated successfully");
  } 
catch (err) {
  console.error("UPDATE ERROR FULL:", err);
  console.error("UPDATE RESPONSE:", err.response?.data);
  setMessage(err.response?.data?.error || "Failed to update profile");
}
};
  if (loading) return <p>Loading profile…</p>;
  if (!profile) return <p>No profile data found</p>;

  return (
    <div>
      <h2>My Profile</h2>

      <div role="alert" aria-live="assertive">
        {message}
      </div>

      <section>
        <h3>Work Details</h3>
        <p><strong>Name:</strong> {profile.full_name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Designation:</strong> {profile.designation}</p>
        <p><strong>Salary:</strong> {profile.salary}</p>
        <p><strong>Department:</strong> {profile.department_name}</p>
        <p><strong>Role:</strong> {profile.role_name}</p>
      </section>

      <hr />

      <form onSubmit={handleSubmit}>
        <h3>Personal Details</h3>

        <label>
          Phone
          <input name="phone" value={profile.phone || ""} onChange={handleChange} />
        </label>

        <label>
          Address
          <textarea name="address" value={profile.address || ""} onChange={handleChange} />
        </label>

        <label>
          Date of Birth
          <input
            type="date"
            name="date_of_birth"
            value={profile.date_of_birth?.split("T")[0] || ""}
            onChange={handleChange}
          />
        </label>

        <label>
          Emergency Contact
          <input name="emergency_contact" value={profile.emergency_contact || ""} onChange={handleChange} />
        </label>

        <label>
          Gender
          <select name="gender" value={profile.gender || ""} onChange={handleChange}>
            <option value="">Select</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </label>

        <label>
          Blood Group
          <input name="blood_group" value={profile.blood_group || ""} onChange={handleChange} />
        </label>

        <br />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EmployeeProfile;