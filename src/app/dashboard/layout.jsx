import React from "react";
import Navbar from "./components/header";
import CryptoTicker from "./components/current";
export default function DashboardLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <CryptoTicker />
      <main className="flex-grow m-0">{children}</main>
      <footer className="bg-gray-800 text-white p-4 text-center">
        &copy; 2023 Crypto Trading Platform
      </footer>
    </div>
  );
}
