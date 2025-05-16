"use client";
import React, { useEffect, useState } from "react";
import AppLog from "../../../assets/svg/logo.svg";
import NavBg from "../../../assets/svg/navbg.svg";
import Log from "../../../assets/svg/log.svg";
import Wor from "../../../assets/svg/world.svg";
import Menu from "../../../assets/svg/menu.svg";

// Styles
const headerStyle = {
  background: "#1C2127",
  color: "#fff",
  padding: "10px 20px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  position: "relative",
  flexWrap: "wrap",
};

const leftContainerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const rightContainerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const desktopNavStyle = {
  display: "flex",
  gap: "20px",
  marginLeft: "20px",
};

const navLinkStyle = {
  color: "#ccc",
  textDecoration: "none",
  fontSize: "16px",
};

const userInfoStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  backgroundImage: `url(${NavBg.src})`,
  padding: "12px",
  borderRadius: "10px",
};

const avatarStyle = {
  height: "24px",
  width: "24px",
  borderRadius: "50%",
};

const mobileAvatarStyle = {
  height: "34px",
  width: "34px",
  borderRadius: "50%",
};

const userTextStyle = {
  fontSize: "13px",
};

const iconButtonStyle = {
  background: "none",
  border: "none",
  color: "#ccc",
  fontSize: "18px",
  cursor: "pointer",
};

const menuButtonStyle = {
  ...iconButtonStyle,
  display: "flex",
  alignItems: "center",
};

const mobileMenuStyle = {
  position: "absolute",
  top: "100%",
  right: 0,
  background: "#1C2127",
  padding: "20px",
  borderRadius: "0 0 10px 10px",
  boxShadow: "0px 5px 10px rgba(0,0,0,0.2)",
  zIndex: 1000,
  width: "50%",
};

const mobileNavStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "15px",
};

const mobileNavLinkStyle = {
  color: "#fff",
  textDecoration: "none",
  fontSize: "16px",
  padding: "10px 0",
  display: "block",
  borderBottom: "1px solid #2a3038",
};

const mobileLogoutButtonStyle = {
  ...iconButtonStyle,
  display: "flex",
  alignItems: "center",
  padding: "10px 0",
};

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );
  const [loading, setLoading] = useState(true);

  // Robust user fetching function
  const fetchUser = async () => {
    try {
      // First check localStorage
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        return;
      }

      // If not in localStorage, try to fetch from API
      const response = await fetch("/api/user", {
        credentials: "include", // For cookies if using session-based auth
      });

      if (response.ok) {
        const userData = await response.json();
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
      } else {
        console.error("Failed to fetch user:", response.status);
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();

    // Set up listener for storage events to sync across tabs
    const handleStorageChange = (e) => {
      if (e.key === "user") {
        fetchUser();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const isMobile = windowWidth <= 768;

  const handleMenuClick = () => {
    setShowMenu(!showMenu);
  };

  const handleLogout = () => {
    if (window.confirm("Do you want to logout?")) {
      // Clear client-side storage
      localStorage.removeItem("user");
      setUser(null);

      // Call logout API
      fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      })
        .then(() => {
          window.location.href = "/login";
        })
        .catch((error) => {
          console.error("Logout error:", error);
          window.location.href = "/login";
        });
    }
  };

  // Safe user data access
  const getUserIdentifier = () => {
    if (!user) return "user";
    return user.username || user.email?.split("@")[0] || "user";
  };

  if (loading) {
    return (
      <header style={headerStyle}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src={AppLog.src} alt="Logo" style={{ height: 40 }} />
        </div>
      </header>
    );
  }

  return (
    <header style={headerStyle}>
      {/* Left side */}
      <div style={leftContainerStyle}>
        <img src={AppLog.src} alt="Logo" style={{ height: 30 }} />

        {!isMobile && (
          <nav style={desktopNavStyle}>
            <a href="#" style={navLinkStyle}>
              Exchange
            </a>
            <a href="#" style={navLinkStyle}>
              Wallets
            </a>
            <a href="#" style={navLinkStyle}>
              Roqqu Hub
            </a>
          </nav>
        )}
      </div>

      {/* Right side */}
      <div style={rightContainerStyle}>
        {user && !isMobile && (
          <div style={userInfoStyle}>
            <img
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${getUserIdentifier()}`}
              alt="Avatar"
              style={avatarStyle}
            />
            <span style={userTextStyle}>
              {user.email || user.username || "User"}
            </span>
          </div>
        )}

        {!isMobile && (
          <>
            <button title="Language" style={iconButtonStyle}>
              <img src={Wor.src} alt="World" style={{ height: 20 }} />
            </button>
            <button
              title="Logout"
              style={iconButtonStyle}
              onClick={handleLogout}
            >
              <img src={Log.src} alt="Logout" style={{ height: 20 }} />
            </button>
          </>
        )}

        {isMobile && (
          <>
            {user && (
              <img
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${getUserIdentifier()}`}
                alt="Avatar"
                style={mobileAvatarStyle}
              />
            )}
            <button title="Language" style={iconButtonStyle}>
              <img src={Wor.src} alt="World" style={{ height: 20 }} />
            </button>
            <button
              title="Menu"
              style={menuButtonStyle}
              onClick={handleMenuClick}
            >
              <img src={Menu.src} alt="Menu" style={{ height: 30 }} />
            </button>
          </>
        )}
      </div>

      {/* Mobile Menu */}
      {showMenu && isMobile && (
        <div style={mobileMenuStyle}>
          <nav style={mobileNavStyle}>
            <a href="#" style={mobileNavLinkStyle}>
              Exchange
            </a>
            <a href="#" style={mobileNavLinkStyle}>
              Wallets
            </a>
            <a href="#" style={mobileNavLinkStyle}>
              Roqqu Hub
            </a>
            <button
              title="Logout"
              style={mobileLogoutButtonStyle}
              onClick={handleLogout}
            >
              <img src={Log.src} alt="Logout" style={{ height: 20 }} />
              <span style={{ marginLeft: 8 }}>Logout</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
