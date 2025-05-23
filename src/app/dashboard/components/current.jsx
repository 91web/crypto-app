"use client";

import { useEffect, useRef, useState } from "react";
import Arrow from "../../../assets/svg/arrow.svg";
import Up from "../../../assets/svg/up.svg";
import Down from "../../../assets/svg/dow.svg";
import Volume from "../../../assets/svg/volume.svg";
import styles from "../../style/current.css";

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
    <div className={`crypto-ticker ${isMobile ? "mobile" : ""}`}>
      {/* Left section with coin info */}
      <div className="coin-info-section">
        {/* Coin icon */}
        <div className="coin-icon">
          {cryptoData?.image?.small ? (
            <img
              src={cryptoData.image.small || "/placeholder.svg"}
              alt={cryptoData.name}
              className="coin-image"
            />
          ) : (
            <span className="coin-placeholder">₿</span>
          )}
        </div>

        {/* Dropdown and price */}
        <div className="coin-selector-wrapper">
          {/* Dropdown */}
          <div ref={dropdownRef} className="dropdown-container">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="dropdown-button"
            >
              {selectedCoin.symbol}{" "}
              <img src={Arrow.src} alt="Arrow" className="dropdown-arrow" />
            </button>

            {showDropdown && (
              <div className="dropdown-menu">
                {coins.map((coin) => (
                  <div
                    key={coin.id}
                    onClick={() => handleCoinSelect(coin)}
                    className={`dropdown-item ${
                      selectedCoin.id === coin.id ? "active" : ""
                    }`}
                  >
                    {coin.symbol}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Coin pair */}
          <span className="coin-pair">{selectedCoin.symbol}/USDT</span>

          {/* Price */}
          <span className="coin-price">
            {cryptoData
              ? formatPrice(cryptoData.market_data.current_price.usd)
              : "$0.00"}
          </span>
        </div>
      </div>

      {/* Right section with stats */}
      <div className="stats-section">
        {/* 24h change */}
        <div className="stat-item">
          <div className="stat-header">
            <svg className="stat-icon" viewBox="0 0 24 24" fill="none">
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
              className="stat-value"
              style={{
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
        <div className="stat-item">
          <div className="stat-header">
            <img src={Up.src} alt="Up" className="stat-icon-img" />
            <span>24h high</span>
          </div>
          {cryptoData && (
            <div className="stat-value positive">
              {formatPrice(cryptoData.market_data.high_24h.usd)}
            </div>
          )}
        </div>

        {/* 24h low */}
        <div className="stat-item">
          <div className="stat-header">
            <img src={Down.src} alt="Down" className="stat-icon-img" />
            <span>24h low</span>
          </div>
          {cryptoData && (
            <div className="stat-value negative">
              {formatPrice(cryptoData.market_data.low_24h.usd)}
            </div>
          )}
        </div>

        {/* 24h volume */}
        <div className="stat-item">
          <div className="stat-header">
            <img src={Volume.src} alt="Volume" className="stat-icon-img" />
            <span>24h volume</span>
          </div>
          {cryptoData && (
            <div className="stat-value">
              {formatNumber(cryptoData.market_data.total_volume.usd)}
            </div>
          )}
        </div>
      </div>

      {/* Loading overlay */}
      {loading && <div className="overlay loading-overlay">Loading...</div>}

      {/* Error overlay */}
      {error && <div className="overlay error-overlay">Error loading data</div>}
    </div>
  );
};

export default CryptoTicker;

