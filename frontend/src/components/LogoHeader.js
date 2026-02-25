import React from "react";
import logo from "../assets/hrflow-logo.jpeg";

const LogoHeader = () => {
  return (
    <div
      style={{
        width: "100%",
        padding: "15px 30px",
        backgroundColor: "white",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        display: "flex",
        alignItems: "center"
      }}
    >
      <img
        src={logo}
        alt="HRFlow Logo"
        style={{
          width: "120px",
          height: "auto"
        }}
      />
    </div>
  );
};

export default LogoHeader;