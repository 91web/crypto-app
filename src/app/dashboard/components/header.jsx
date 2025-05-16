"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppLog from "../../../assets/svg/logo.svg";

import Log from "../../../assets/svg/log.svg";
import Wor from "../../../assets/svg/world.svg";
import Menu from "../../../assets/svg/menu.svg";
import styles from "../../style/header.css";
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
