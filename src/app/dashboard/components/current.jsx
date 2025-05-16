"use client";

import { useEffect, useRef, useState } from "react";
import Arrow from "../../../assets/svg/arrow.svg";
import Up from "../../../assets/svg/up.svg";
import Down from "../../../assets/svg/dow.svg";
import Volume from "../../../assets/svg/volume.svg";

const CryptoTicker = () => {
  const [cryptoData, setCryptoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState({
    id: "bitcoin",
    symbol: "BTC",
  });
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef(null);

  // List of available coins
  const coins = [
    { id: "bitcoin", symbol: "BTC" },
    { id: "ethereum", symbol: "ETH" },
    { id: "ripple", symbol: "XRP" },
    { id: "cardano", symbol: "ADA" },
    { id: "solana", symbol: "SOL" },
    { id: "dogecoin", symbol: "DOGE" },
    { id: "polkadot", symbol: "DOT" },
    { id: "litecoin", symbol: "LTC" },
    { id: "avalanche-2", symbol: "AVAX" },
    { id: "chainlink", symbol: "LINK" },
  ];

  // Check if mobile
  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(false);

      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${selectedCoin.id}?localization=false`
        );
        if (!response.ok) throw new Error("API request failed");
        const data = await response.json();
        setCryptoData(data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [selectedCoin]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle coin selection
  const handleCoinSelect = (coin) => {
    setSelectedCoin(coin);
    setShowDropdown(false);
  };

  // Format price with currency symbol
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(price);
  };

  // Format number with commas
  const formatNumber = (num) => {
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2,
    }).format(num);
  };

  // Format percentage
  const formatPercentage = (percent) => {
    const sign = percent >= 0 ? "+" : "";
    return `${sign}${percent.toFixed(2)}%`;
  };

  // Determine if value is positive or negative
  const getValueColor = (value) => {
    return value >= 0 ? "#4CAF50" : "#F44336";
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: isMobile ? "flex-start" : "center",
        justifyContent: "left",
        backgroundColor: "#20252B",
        color: "white",
        padding: "5px",
        borderRadius: "4px",
        position: "relative",
        width: "100%",
        boxSizing: "border-box",
        transition: "all 0.3s ease",
        gap: isMobile ? "10px" : "44px",
        marginTop: " 5px",
      }}
    >
      {/* Left section with coin info */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: isMobile ? "12px" : "0",
        }}
      >
        {/* Coin icon */}
        <div
          style={{
            width: "32px",
            height: "32px",
            marginRight: "12px",
            borderRadius: "50%",
            backgroundColor: "#f7931a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {cryptoData?.image?.small ? (
            <img
              src={cryptoData.image.small || "/placeholder.svg"}
              alt={cryptoData.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span style={{ fontWeight: "bold", color: "white" }}>₿</span>
          )}
        </div>

        {/* Dropdown and price */}
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* Dropdown */}
          <div
            ref={dropdownRef}
            style={{ position: "relative", marginRight: "8px" }}
          >
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              style={{
                backgroundColor: "#333",
                color: "white",
                padding: "4px 8px",
                fontSize: "12px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                transition: "background-color 0.2s",
                outline: "none",
              }}
            >
              {selectedCoin.symbol}{" "}
              <img
                src={Arrow.src}
                alt="Arrow"
                style={{
                  width: "12px",
                  height: "12px",
                  marginLeft: "4px",
                  display: "inline-block",
                }}
              />
            </button>

            {showDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: "0",
                  backgroundColor: "#1e1e1e",
                  minWidth: "120px",
                  boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.5)",
                  zIndex: "1",
                  borderRadius: "4px",
                  maxHeight: "200px",
                  overflowY: "auto",
                }}
              >
                {coins.map((coin) => (
                  <div
                    key={coin.id}
                    onClick={() => handleCoinSelect(coin)}
                    style={{
                      color: "white",
                      padding: "8px 12px",
                      textDecoration: "none",
                      display: "block",
                      fontSize: "12px",
                      cursor: "pointer",
                      backgroundColor:
                        selectedCoin.id === coin.id ? "#333" : "transparent",
                      transition: "background-color 0.2s",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.backgroundColor = "#333")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        selectedCoin.id === coin.id ? "#333" : "transparent")
                    }
                  >
                    {coin.symbol}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Coin pair */}
          <span
            style={{ fontWeight: "600", marginRight: "12px", fontSize: "14px" }}
          >
            {selectedCoin.symbol}/USDT
          </span>

          {/* Price */}
          <span
            style={{ fontWeight: "700", fontSize: "18px", color: "#4CAF50" }}
          >
            {cryptoData
              ? formatPrice(cryptoData.market_data.current_price.usd)
              : "$0.00"}
          </span>
        </div>
      </div>

      {/* Right section with stats */}
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "row" : "row",
          flexWrap: isMobile ? "nowrap" : "nowrap",
          gap: isMobile ? "10px" : "24px",
          overflowX: isMobile ? "auto" : "hidden",
          width: isMobile ? "100%" : "auto",
          paddingBottom: isMobile ? "4px" : "0",
        }}
      >
        {/* 24h change */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minWidth: isMobile ? "80px" : "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: "#9e9e9e",
              fontSize: "12px",
              marginBottom: "2px",
            }}
          >
            <svg
              style={{ width: "14px", height: "14px", marginRight: "4px" }}
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M12 7V12L15 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span>24h change</span>
          </div>
          {cryptoData && (
            <div
              style={{
                fontSize: "12px",
                color: getValueColor(
                  cryptoData.market_data.price_change_percentage_24h
                ),
              }}
            >
              {formatPrice(
                cryptoData.market_data.price_change_24h_in_currency.usd
              )}{" "}
              {formatPercentage(
                cryptoData.market_data.price_change_percentage_24h
              )}
            </div>
          )}
        </div>

        {/* 24h high */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minWidth: isMobile ? "80px" : "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: "#9e9e9e",
              fontSize: "12px",
              marginBottom: "2px",
            }}
          >
            <img
              src={Up.src}
              alt="Up"
              style={{ width: "14px", height: "14px", marginRight: "4px" }}
            />
            <span>24h high</span>
          </div>
          {cryptoData && (
            <div style={{ fontSize: "12px", color: "#4CAF50" }}>
              {formatPrice(cryptoData.market_data.high_24h.usd)}
            </div>
          )}
        </div>

        {/* 24h low */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minWidth: isMobile ? "80px" : "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: "#9e9e9e",
              fontSize: "12px",
              marginBottom: "2px",
            }}
          >
            <img
              src={Down.src}
              alt="Down"
              style={{ width: "14px", height: "14px", marginRight: "4px" }}
            />
            <span>24h low</span>
          </div>
          {cryptoData && (
            <div style={{ fontSize: "12px", color: "#F44336" }}>
              {formatPrice(cryptoData.market_data.low_24h.usd)}
            </div>
          )}
        </div>

        {/* 24h volume */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minWidth: isMobile ? "80px" : "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: "#9e9e9e",
              fontSize: "12px",
              marginBottom: "2px",
            }}
          >
            <img
              src={Volume.src}
              alt="Volume"
              style={{ width: "14px", height: "14px", marginRight: "4px" }}
            />
            <span>24h volume</span>
          </div>
          {cryptoData && (
            <div style={{ fontSize: "12px", color: "white" }}>
              {formatNumber(cryptoData.market_data.total_volume.usd)}
            </div>
          )}
        </div>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            backgroundColor: "rgba(18, 18, 18, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
            color: "white",
            borderRadius: "4px",
          }}
        >
          Loading...
        </div>
      )}

      {/* Error overlay */}
      {error && (
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            backgroundColor: "rgba(244, 67, 54, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
            color: "white",
            borderRadius: "4px",
          }}
        >
          Error loading data
        </div>
      )}
    </div>
  );
};

export default CryptoTicker;
