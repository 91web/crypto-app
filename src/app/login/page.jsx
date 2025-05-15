"use client";
import React, { useState } from "react";
import AppLog from "../../assets/svg/logo.svg";
import bcrypt from "bcryptjs";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isHover, setIsHover] = useState(false);

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
        onSubmit={handleSubmit}
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
          Crypto Login
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
        <div style={{ position: "relative", marginBottom: 16 }}>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ marginRight: 8 }}
            />
            <span style={{ color: "#fff" }}>Remember Me</span>
          </div>
          <a href="/forgot-password" className="link">
            Forgot Password?
          </a>
        </div>
        <button
          type="submit"
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          style={{
            width: "100%",
            padding: 10,
            background: isHover
              ? "linear-gradient(90deg, #5a49ec 0%, #8a67f5 50%, #f77fbb 100%)"
              : "linear-gradient(90deg, #483BEB 0%, #7847E1 47.92%, #DD568D 96.35%)",
            borderRadius: 8,
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Login
        </button>
        <p style={{ textAlign: "center", color: "#fff", marginTop: 16 }}>
          Don't have an account?{" "}
          <a href="/sign-up" className="link">
            Sign Up
          </a>
        </p>
        <p style={{ textAlign: "center", color: "#fff", marginTop: 16 }}>
          By logging in, you agree to our{" "}
          <a href="#" className="link">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="link">
            Privacy Policy
          </a>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
