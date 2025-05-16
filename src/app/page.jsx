"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppLog from "../assets/svg/logo.svg";

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1e1e1e, #121212)",
    color: "#EEE",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: "20px",
  },
  progressBarContainer: {
    width: "10%",
    height: "10px",
    backgroundColor: "#555",
    borderRadius: "5px",
    overflow: "hidden",
    marginBottom: "10px",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "rgb(122,71,223)",
    transition: "width 0.3s ease-out",
  },
  percentage: {
    fontSize: "1.2rem",
    marginBottom: "10px",
  },
  message: {
    fontSize: "1.4rem",
  },
};

export default function LoaderPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 1;
        if (next >= 100) {
          clearInterval(interval);
          setLoading(false);
          router.push("/login");
          return 100;
        }
        return next;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [router]);

  return (
    <>
      <style jsx>{`
        @keyframes pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
      <div style={styles.container}>
        <img
          src={AppLog.src}
          alt="Logo"
          style={{
            width: 200,
            marginBottom: "5px",
            display: "block",
            marginY: "2px",

            opacity: progress < 100 ? 0.9 : 0.1,
            animation: progress < 100 ? "pulse 2s infinite" : "none",
            transition: "opacity 0.3s ease-out",
          }}
        />
        <div style={styles.progressBarContainer}>
          <div style={{ ...styles.progressBar, width: `${progress}%` }}></div>
        </div>
        <p style={styles.percentage}>{progress}%</p>
        <p style={styles.message}>
          {loading ? "Initializing Crypto App..." : "Redirecting..."}
        </p>
      </div>
    </>
  );
}
