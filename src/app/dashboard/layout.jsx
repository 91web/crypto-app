import React from "react";
import Navbar from "./components/header";
import CryptoTicker from "./components/current";

export default function DashboardLayout({ children }) {

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      {" "}
      {/* Added overflow-x-hidden */}
      <Navbar />
      <CryptoTicker />
      <main className="flex-grow m-0 max-w-full overflow-x-hidden">
        {" "}
        {/* Added overflow control */}
        <div className="w-full max-w-full">
          {" "}
          {/* Additional containment */}
          {children}
        </div>
      </main>

    </div>
  );
}
