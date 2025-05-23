"use client";
import { useState } from "react";

export default function History() {
  const [activeTab, setActiveTab] = useState("Open Orders");
  const tabs = ["Open Orders", "Positions", "Order History", "Trade History"];

  return (
    <div
      style={{
        backgroundColor: "#0B0B0B",
        color: "#fff",
        minHeight: "30vh",
        padding: "20px",
      //  fontFamily: "Arial, sans-serif",
        overflow: "hidden", // Completely prevent any scrolling
      }}
    >
      {/* Navigation Tabs - Now with wrapping behavior */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap", // Allow tabs to wrap to new lines
          gap: "10px", // Space between tabs
          borderBottom: "1px solid #2c2f36",
          marginBottom: "40px",
        }}
      >
        {tabs.map((tab) => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "12px 20px", // Reduced padding for mobile
              cursor: "pointer",
              backgroundColor: activeTab === tab ? "#1e2128" : "transparent",
              border: activeTab === tab ? "1px solid #2c2f36" : "none",
              borderRadius: activeTab === tab ? "4px" : "0",
              color: activeTab === tab ? "#fff" : "#8a8d94",
              fontSize: "12px",
              fontWeight: "500",
              whiteSpace: "nowrap", // Keep tab text on one line
            }}
          >
            {tab}
          </div>
        ))}
      </div>
      {/* Content Area */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "calc(100vh - 150px)",
          textAlign: "center",
        }}
      >
        <h2
          style={{ fontSize: "28px", fontWeight: "500", marginBottom: "15px" }}
        >
          No Open Orders
        </h2>
        <p
          style={{
            fontSize: "16px",
            lineHeight: 1.5,
            color: "#8a8d94",
            margin: 0,
          }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          <br />
          Id pulvinar nullam sit imperdiet pulvinar.
        </p>
      </div>
    </div>
  );
}
