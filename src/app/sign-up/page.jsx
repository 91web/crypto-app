"use client";
import React, { useState } from "react";
import AppLog from "../../assets/svg/logo.svg";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { useRouter } from "next/navigation";

function SignUp() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const router = useRouter();
  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!email || !username || !password || !confirmPassword) {
      setMessage({ text: "Please fill in all fields", type: "error" });
      return;
    }

    if (!emailRegex.test(email)) {
      setMessage({ text: "Invalid email format", type: "error" });
      return;
    }

    if (!passwordRegex.test(password)) {
      setMessage({
        text: "Password must be at least 8 characters, contain at least one lowercase letter, one uppercase letter, one number, and one special character",
        type: "error",
      });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ text: "Passwords do not match", type: "error" });
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];

    // Check if email already exists
    const emailExists = existingUsers.some((user) => user.email === email);

    if (emailExists) {
      setMessage({ text: "Email already registered", type: "error" });
      return;
    }

    const userId = uuidv4();
    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = {
      id: userId,
      email,
      username,
      password: hashedPassword,
    };

    existingUsers.push(newUser);
    localStorage.setItem("users", JSON.stringify(existingUsers));

    setMessage({
      text: "Registration successful! Redirecting to login...",
      type: "success",
    });

    setTimeout(() => {
      router.push("/login");
    }, 1500);
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
          Crypto Register
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
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
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
          Register
        </button>
        <p
          style={{
            textAlign: "center",
            color: "#fff",
            marginTop: 16,
            fontSize: 16,
          }}
        >
          Already have an account?{" "}
          <a href="/login" className="link">
            Login
          </a>
        </p>
        <p
          style={{
            textAlign: "center",
            color: "#fff",
            marginTop: 16,
            fontSize: "12px",
          }}
        >
          By registering, you agree to our{" "}
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

export default SignUp;
