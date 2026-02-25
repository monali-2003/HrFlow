import React, { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      if (res.data.user.role === "Employee") {
        navigate("/employee");
      } else if (res.data.user.role === "Manager") {
        navigate("/manager");
      } else {
        navigate("/admin");
      }
    } catch (err) {
      alert("Invalid login");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #4e73df, #1cc88a)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          backgroundColor: "white",
          padding: "40px",
          width: "350px",
          borderRadius: "12px",
          boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            marginBottom: "25px",
            color: "#333",
          }}
        >
          HR Flow Login
        </h2>

        {/* Email Input */}
        <div style={{ marginBottom: "20px" }}>
          <input
            type="email"
            placeholder="Enter Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "14px",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Password Input */}
        <div style={{ marginBottom: "25px" }}>
          <input
            type="password"
            placeholder="Enter Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "14px",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Login Button */}
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#4e73df",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;