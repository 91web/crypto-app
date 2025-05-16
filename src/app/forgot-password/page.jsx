"use client";
import React, { useState } from "react";
import AppLog from "../../assets/svg/logo.svg";
import { useRouter } from "next/navigation";
import bcrypt from "bcryptjs";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEmailFound, setIsEmailFound] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const router = useRouter();

  const handleFindAccount = (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setMessage({ text: "Please enter a valid email address", type: "error" });
      return;
    }

    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      // Assuming 'users' is an array of user objects
      const user = users.find((u) => u.email === email.toLowerCase());
      if (user) {
        setIsEmailFound(true);
        setMessage({
          text: "Account found. Please reset your password.",
          type: "success",
        });
      } else {
        setMessage({ text: "No account found with this email", type: "error" });
        setTimeout(() => router.push("/sign-up"), 2000);
      }
    } else {
      setMessage({
        text: "No user data found. Please register.",
        type: "error",
      });
      setTimeout(() => router.push("/sign-up"), 2000);
    }
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordRegex.test(password)) {
      setMessage({
        text: "Password must be at least 8 characters, include upper/lowercase letters, numbers, and a special character.",
        type: "error",
      });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ text: "Passwords do not match", type: "error" });
      return;
    }

    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      let users = JSON.parse(storedUsers);
      const userIndex = users.findIndex((u) => u.email === email.toLowerCase());
      if (userIndex !== -1) {
        const hashedPassword = bcrypt.hashSync(password, 10);
        users[userIndex] = { ...users[userIndex], password: hashedPassword };
        localStorage.setItem("users", JSON.stringify(users));

        setMessage({ text: "Password reset successfully!", type: "success" });
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setMessage({ text: "Account verification failed", type: "error" });
        setTimeout(() => router.push("/login"), 2000);
      }
    } else {
      setMessage({ text: "Account not found", type: "error" });
      setTimeout(() => router.push("/sign-up"), 2000);
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
        <h2 style={{ textAlign: "center", color: "#fff", marginBottom: 24 }}>
          {isEmailFound ? "Reset Password" : "Find Your Account"}
        </h2>

        {message.text && (
          <div
            style={{
              padding: "10px",
              borderRadius: "4px",
              marginBottom: "16px",
              backgroundColor:
                message.type === "success"
                  ? "rgba(40, 167, 69, 0.2)"
                  : "rgba(220, 53, 69, 0.2)",
              color: message.type === "success" ? "#28a745" : "#dc3545",
              textAlign: "center",
              border: `1px solid ${
                message.type === "success" ? "#28a745" : "#dc3545"
              }`,
            }}
          >
            {message.text}
          </div>
        )}

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value.toLowerCase())}
          placeholder="Enter your email"
          style={{
            width: "100%",
            padding: 8,
            borderRadius: 4,
            border: "1px solid #ccc",
            backgroundColor: "#333",
            color: "#fff",
            marginBottom: 16,
          }}
          disabled={isEmailFound}
          required
        />

        {isEmailFound && (
          <>
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
                required
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
                placeholder="Confirm Password"
                style={{
                  width: "100%",
                  padding: 8,
                  borderRadius: 4,
                  border: "1px solid #ccc",
                  backgroundColor: "#333",
                  color: "#fff",
                  paddingRight: 40,
                }}
                required
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
          </>
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

        <p style={{ textAlign: "center", color: "#fff", marginTop: 16 }}>
          <a
            href="/login"
            style={{ color: "#8a67f5", textDecoration: "underline" }}
          >
            Back to Login
          </a>
        </p>
      </form>
    </div>
  );
}

export default ForgotPasswordPage;
