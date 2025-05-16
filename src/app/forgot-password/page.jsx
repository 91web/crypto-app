"use client";
import React, { useState } from "react";
import AppLog from "../../assets/svg/logo.svg";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEmailFound, setIsEmailFound] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFindAccount = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate email
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.email === email) {
        setIsEmailFound(true);
        setSuccess("Account found. Please set a new password.");
      } else {
        setError("No account found with this email");
        setTimeout(() => {
          window.location.href = "/sign-up";
        }, 2000);
      }
    }
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate password
    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.email === email) {
        // In a real app, you would hash the password before saving
        const updatedUser = { ...user, password };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setSuccess("Password reset successfully!");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        setError("Account verification failed");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      }
    } else {
      setError("Account not found");
      setTimeout(() => {
        window.location.href = "/sign-up";
      }, 2000);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1C2127",
      }}
    >
      <form
        onSubmit={isEmailFound ? handleResetPassword : handleFindAccount}
        style={{
          padding: 40,
          borderRadius: 8,
          backgroundColor: "#20252B",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: 500,
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
          {isEmailFound ? "Reset Password" : "Forgot Password"}
        </h2>

        {error && (
          <div
            style={{
              color: "#ff6b6b",
              backgroundColor: "rgba(255, 107, 107, 0.1)",
              padding: "10px",
              borderRadius: 4,
              marginBottom: 16,
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              color: "#51cf66",
              backgroundColor: "rgba(81, 207, 102, 0.1)",
              padding: "10px",
              borderRadius: 4,
              marginBottom: 16,
              textAlign: "center",
            }}
          >
            {success}
          </div>
        )}

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 4,
            border: "1px solid #2a3038",
            backgroundColor: "#2a3038",
            color: "#fff",
            marginBottom: 16,
          }}
          disabled={isEmailFound}
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
                  padding: 12,
                  borderRadius: 4,
                  border: "1px solid #2a3038",
                  backgroundColor: "#2a3038",
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
                  padding: 12,
                  borderRadius: 4,
                  border: "1px solid #2a3038",
                  backgroundColor: "#2a3038",
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
            padding: 12,
            background:
              "linear-gradient(90deg, #483BEB 0%, #7847E1 47.92%, #DD568D 96.35%)",
            borderRadius: 8,
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: 16,
            marginTop: 8,
          }}
        >
          {isEmailFound ? "Reset Password" : "Continue"}
        </button>

        {isEmailFound && (
          <button
            type="button"
            onClick={() => {
              setIsEmailFound(false);
              setPassword("");
              setConfirmPassword("");
            }}
            style={{
              width: "100%",
              padding: 12,
              background: "transparent",
              borderRadius: 8,
              color: "#ccc",
              border: "1px solid #2a3038",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: 16,
              marginTop: 16,
            }}
          >
            Back
          </button>
        )}
      </form>
    </div>
  );
}

export default ForgotPasswordPage;
