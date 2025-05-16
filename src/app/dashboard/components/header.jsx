"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppLog from "../../../assets/svg/logo.svg";
import NavBg from "../../../assets/svg/navbg.svg";
import Log from "../../../assets/svg/log.svg";
import Wor from "../../../assets/svg/world.svg";
import Menu from "../../../assets/svg/menu.svg";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1024);
  const [loading, setLoading] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Simulate user fetch
    const timer = setTimeout(() => {
      setUser({
        email: "user@example.com",
        username: "demoUser",
      });
      setLoading(false);
    }, 500);

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isMobile = windowWidth <= 768;

  const handleMenuClick = () => {
    setShowMenu(!showMenu);
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setUser(null);
    setShowLogoutConfirm(false);
    router.push("/login");
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const getUserIdentifier = () => {
    if (!user) return "user";
    return user.username || user.email?.split("@")[0] || "user";
  };

  // Styles
  const styles = {
    header: {
      background: "#1C2127",
      color: "#fff",
      padding: "10px 20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      position: "relative",
      flexWrap: "wrap",
      width: "100%",
      boxSizing: "border-box",
    },
    leftContainer: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    rightContainer: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    desktopNav: {
      display: "flex",
      gap: "20px",
      marginLeft: "20px",
    },
    navLink: {
      color: "#ccc",
      textDecoration: "none",
      fontSize: "16px",
      whiteSpace: "nowrap",
    },
    userInfo: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      backgroundImage: `url(${NavBg.src})`,
      padding: "12px",
      borderRadius: "10px",
      backgroundSize: "cover",
      backgroundPosition: "center",
      cursor: "pointer",
    },
    avatar: {
      height: "24px",
      width: "24px",
      borderRadius: "50%",
      objectFit: "cover",
    },
    mobileAvatar: {
      height: "34px",
      width: "34px",
      borderRadius: "50%",
      objectFit: "cover",
      cursor: "pointer",
    },
    userText: {
      fontSize: "13px",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxWidth: "120px",
    },
    iconButton: {
      background: "none",
      border: "none",
      color: "#ccc",
      fontSize: "18px",
      cursor: "pointer",
      padding: "5px",
    },
    menuButton: {
      background: "none",
      border: "none",
      color: "#ccc",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      padding: "5px",
    },
    mobileMenu: {
      position: "absolute",
      top: "100%",
      right: "0",
      background: "#1C2127",
      padding: "20px",
      borderRadius: "0 0 10px 10px",
      boxShadow: "0px 5px 10px rgba(0,0,0,0.2)",
      zIndex: 1000,
      width: "200px",
    },
    mobileNav: {
      display: "flex",
      flexDirection: "column",
      gap: "15px",
    },
    mobileNavLink: {
      color: "#fff",
      textDecoration: "none",
      fontSize: "16px",
      padding: "10px 0",
      display: "block",
      borderBottom: "1px solid #2a3038",
    },
    mobileLogoutButton: {
      background: "none",
      border: "none",
      color: "#fff",
      fontSize: "16px",
      cursor: "pointer",
      padding: "10px 0",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    confirmDialog: {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      background: "#2A3038",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
      zIndex: 2000,
      width: "300px",
      textAlign: "center",
    },
    confirmButton: {
      background: "#E53E3E",
      color: "white",
      border: "none",
      padding: "8px 16px",
      borderRadius: "4px",
      margin: "0 10px",
      cursor: "pointer",
    },
    cancelButton: {
      background: "#4A5568",
      color: "white",
      border: "none",
      padding: "8px 16px",
      borderRadius: "4px",
      margin: "0 10px",
      cursor: "pointer",
    },
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.5)",
      zIndex: 1000,
    },
  };

  if (loading) {
    return (
      <header style={styles.header}>
        <div style={styles.leftContainer}>
          <img src={AppLog.src} alt="Logo" style={{ height: "30px" }} />
        </div>
      </header>
    );
  }

  return (
    <>
      <header style={styles.header}>
        {/* Left side */}
        <div style={styles.leftContainer}>
          <img src={AppLog.src} alt="Logo" style={{ height: "30px" }} />

          {!isMobile && (
            <nav style={styles.desktopNav}>
              <a href="#" style={styles.navLink}>
                Exchange
              </a>
              <a href="#" style={styles.navLink}>
                Wallets
              </a>
              <a href="#" style={styles.navLink}>
                Roqqu Hub
              </a>
            </nav>
          )}
        </div>

        {/* Right side */}
        <div style={styles.rightContainer}>
          {user ? (
            <>
              {!isMobile && (
                <div
                  style={styles.userInfo}
                  onClick={() => router.push("/profile")}
                >
                  <img
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${getUserIdentifier()}`}
                    alt="Avatar"
                    style={styles.avatar}
                  />
                  <span style={styles.userText}>
                    {user.email || user.username || "User"}
                  </span>
                </div>
              )}

              {isMobile && (
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${getUserIdentifier()}`}
                  alt="Avatar"
                  style={styles.mobileAvatar}
                  onClick={() => router.push("/profile")}
                />
              )}

              <button title="Language" style={styles.iconButton}>
                <img src={Wor.src} alt="World" style={{ height: "20px" }} />
              </button>

              {!isMobile ? (
                <button
                  title="Logout"
                  style={styles.iconButton}
                  onClick={handleLogout}
                >
                  <img src={Log.src} alt="Logout" style={{ height: "20px" }} />
                </button>
              ) : (
                <button
                  title="Menu"
                  style={styles.menuButton}
                  onClick={handleMenuClick}
                >
                  <img src={Menu.src} alt="Menu" style={{ height: "30px" }} />
                </button>
              )}
            </>
          ) : (
            <button
              style={styles.navLink}
              onClick={() => router.push("/login")}
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile Menu */}
        {showMenu && isMobile && (
          <div style={styles.mobileMenu}>
            <nav style={styles.mobileNav}>
              <a href="#" style={styles.mobileNavLink}>
                Exchange
              </a>
              <a href="#" style={styles.mobileNavLink}>
                Wallets
              </a>
              <a href="#" style={styles.mobileNavLink}>
                Roqqu Hub
              </a>
              <button
                title="Logout"
                style={styles.mobileLogoutButton}
                onClick={handleLogout}
              >
                <img src={Log.src} alt="Logout" style={{ height: "20px" }} />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <>
          <div style={styles.overlay} onClick={cancelLogout} />
          <div style={styles.confirmDialog}>
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>
            <div style={{ marginTop: "20px" }}>
              <button style={styles.confirmButton} onClick={confirmLogout}>
                Yes, Logout
              </button>
              <button style={styles.cancelButton} onClick={cancelLogout}>
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
