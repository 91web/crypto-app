"use client";
import React, { useState } from "react";
import AppLog from "../../assets/svg/logo.svg";
import bcrypt from "bcryptjs";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEmailFound, setIsEmailFound] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.email === email && bcrypt.compareSync(password, user.password)) {
        alert("Login Successful!");
        window.location.href = "/dashboard";
      } else {
        alert("Invalid email or password");
      }
    } else {
      alert("User not found. Please register to proceed!");
      window.location.href = "/sign-up";
    }
  };
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <form
        onSubmit={isEmailFound ? handleResetPassword : handleSubmit}
        style={{
          padding: 40,
          borderRadius: 8,
          backgroundColor: "#20252B",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          width: 500,
          margin: "0 auto",
        }}
      >
        <img
          src={AppLog.src}
          alt="Logo"
          style={{
            width: 200,
            marginBottom: 20,
            display: "block",
            margin: "0 auto",
          }}
        />
        <h2 style={{ textAlign: "center", marginBottom: 24, color: "#fff" }}>
          Forgot Password
        </h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          style={{
            width: "100%",
            padding: 8,
            borderRadius: 4,
            border: "1px solid #ccc",
            backgroundColor: "#333",
            color: "#fff",
            marginBottom: 16,
          }}
        />
        {isEmailFound && (
          <div>
            <div style={{ position: "relative", marginBottom: 16 }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New Password"
                style={{
                  width: "100%",
                  padding: 8,
                  borderRadius: 4,
                  border: "1px solid #ccc",
                  backgroundColor: "#333",
                  color: "#fff",
                  paddingRight: 40,
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  top: 12,
                  right: 8,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#fff",
                }}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <div style={{ position: "relative", marginBottom: 16 }}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm New Password"
                style={{
                  width: "100%",
                  padding: 8,
                  borderRadius: 4,
                  border: "1px solid #ccc",
                  backgroundColor: "#333",
                  color: "#fff",
                  paddingRight: 40,
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: "absolute",
                  top: 12,
                  right: 8,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#fff",
                }}
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
        )}
        <button
          type="submit"
          style={{
            width: "100%",
            padding: 10,
            background:
              "linear-gradient(90deg, #483BEB 0%, #7847E1 47.92%, #DD568D 96.35%)",
            borderRadius: 8,
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {isEmailFound ? "Reset Password" : "Find Account"}
        </button>
      </form>
    </div>
  );
}

export default ForgotPasswordPage;
