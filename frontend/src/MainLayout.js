import React from "react";
import LogoHeader from "./components/LogoHeader";

const MainLayout = ({ children }) => {
  return (
    <>
      <LogoHeader />
      <div style={{ padding: "30px" }}>
        {children}
      </div>
    </>
  );
};

export default MainLayout;