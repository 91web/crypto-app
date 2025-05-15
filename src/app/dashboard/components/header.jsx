"use client";
import React, { useEffect, useState } from "react";
import AppLog from "../../../assets/svg/logo.svg";
import NavBg from "../../../assets/svg/navbg.svg";
import Log from "../../../assets/svg/log.svg";
import Wor from "../../../assets/svg/world.svg";
import Menu from "../../../assets/svg/menu.svg";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth <= 768;

  const handleMenuClick = () => {
    setShowMenu(!showMenu);
  };

  const handleUserInfoClick = () => {
    setShowUserInfo(!showUserInfo);
  };

  return (
    <header
      style={{
        background: "#1C2127",
        color: "#fff",
        padding: "10px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "relative",
        flexWrap: "wrap",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <img
          src={AppLog.src}
          alt="Logo"
          style={{ height: { xs: 20, md: 80 }, marginRight: 1 }}
        />

        {/* Conditionally render desktop nav */}
        {!isMobile && (
          <nav
            style={{
              display: "flex",
              gap: "5px",
                          marginLeft: "20px",
              gap: "20px",
            }}
          >
            <a
              href="#"
              style={{
                color: "#ccc",
                textDecoration: "none",
                fontSize: "16px",
              }}
            >
              Exchange
            </a>
            <a
              href="#"
              style={{
                color: "#ccc",
                textDecoration: "none",
                fontSize: "16px",
              }}
            >
              Wallets
            </a>
            <a
              href="#"
              style={{
                color: "#ccc",
                textDecoration: "none",
                fontSize: "16px",
              }}
            >
              Roqqu Hub
            </a>
          </nav>
        )}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        {user && !isMobile && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundImage: `url(${NavBg.src})`,
              padding: "12px",
              borderRadius: "10px",
            }}
          >
            <img
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`}
              alt="Avatar"
              style={{ height: "24px", width: "24px", borderRadius: "50%" }}
            />
            <span style={{ fontSize: "13px" }}>{user.email}</span>
          </div>
        )}

        {!isMobile && (
          <>
            <button
              title="Language"
              style={{
                background: "none",
                border: "none",
                color: "#ccc",
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
              <img src={Wor.src} alt="World" style={{ height: 20 }} />
            </button>
            <button
              title="Logout"
              style={{
                background: "none",
                border: "none",
                color: "#ccc",
                fontSize: "18px",
                cursor: "pointer",
              }}
              onClick={() => {
                if (window.confirm("Do you want to logout?")) {
                  localStorage.removeItem("user");
                  setUser(null);
                }
              }}
            >
              <img src={Log.src} alt="Logout" style={{ height: 20 }} />
            </button>
          </>
        )}

        {isMobile && (
          <>
            <img
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`}
              alt="Avatar"
              style={{ height: "34px", width: "34px", borderRadius: "50%" }}
            />
            <button
              title="Language"
              style={{
                background: "none",
                border: "none",
                color: "#ccc",
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
              <img src={Wor.src} alt="World" style={{ height: 20 }} />
            </button>

            <button
              title="Menu"
              style={{
                background: "none",
                border: "none",
                color: "#ccc",
                fontSize: "18px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
              onClick={handleMenuClick}
            >
              <img src={Menu.src} alt="Menu" style={{ height: 30 }} />
            </button>
          </>
        )}
      </div>

      {/* Mobile Menu */}
      {showMenu && isMobile && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            //   left: 0,
            right: 0,
            background: "#1C2127",
            padding: "20px",
            borderRadius: "0 0 10px 10px",
            boxShadow: "0px 5px 10px rgba(0,0,0,0.2)",
            zIndex: 1000,
            width: "50%",
          }}
        >
          <nav
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            <a
              href="#"
              style={{
                color: "#fff",
                textDecoration: "none",
                fontSize: "16px",
                padding: "10px 0",
                display: "block",
                borderBottom: "1px solid #2a3038",
              }}
            >
              Exchange
            </a>
            <a
              href="#"
              style={{
                color: "#fff",
                textDecoration: "none",
                fontSize: "16px",
                padding: "10px 0",
                display: "block",
                borderBottom: "1px solid #2a3038",
              }}
            >
              Wallets
            </a>
            <a
              href="#"
              style={{
                color: "#fff",
                textDecoration: "none",
                fontSize: "16px",
                padding: "10px 0",
                display: "block",
                borderBottom: "1px solid #2a3038",
              }}
            >
              Roqqu Hub
            </a>
            <button
              title="Logout"
              style={{
                background: "none",
                border: "none",
                color: "#ccc",
                fontSize: "18px",
                cursor: "pointer",
              }}
              onClick={() => {
                if (window.confirm("Do you want to logout?")) {
                  localStorage.removeItem("user");
                  setUser(null);
                }
              }}
            >
              <img src={Log.src} alt="Logout" style={{ height: 20 }} />
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
