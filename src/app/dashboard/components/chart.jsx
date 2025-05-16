"use client";

import { useEffect, useState, useRef } from "react";
import "../../style/chart.css";
export default function CryptoTradingChart() {
  // State for chart data and UI
  const [cryptoData, setCryptoData] = useState(null);
  const [selectedCrypto, setSelectedCrypto] = useState("bitcoin");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInterval, setSelectedInterval] = useState("1D");
  const [candleData, setCandleData] = useState([]);
  const [volumeData, setVolumeData] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hoveredCandle, setHoveredCandle] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [showCoinSelector, setShowCoinSelector] = useState(false);

  // Available cryptocurrencies
  const availableCryptos = [
    { id: "bitcoin", symbol: "BTC", name: "Bitcoin", color: "#F7931A" },
    { id: "ethereum", symbol: "ETH", name: "Ethereum", color: "#627EEA" },
    { id: "ripple", symbol: "XRP", name: "XRP", color: "#23292F" },
    { id: "cardano", symbol: "ADA", name: "Cardano", color: "#3CC8C8" },
    { id: "solana", symbol: "SOL", name: "Solana", color: "#00FFA3" },
    { id: "polkadot", symbol: "DOT", name: "Polkadot", color: "#E6007A" },
  ];

  // Refs for chart dimensions
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const volumeRef = useRef(null);
  const chartWidth = useRef(0);
  const chartHeight = useRef(0);
  const volumeHeight = useRef(0);
  const mousePositionRef = useRef({ x: 0, y: 0 });

  // Fetch cryptocurrency data from CoinGecko API
  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${selectedCrypto}?localization=false`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        setCryptoData(data);

        // Generate mock candle data based on current price
        const basePrice = data.market_data.current_price.usd;
        generateMockData(basePrice);

        setLoading(false);
      } catch (err) {
        setError(`Error fetching ${selectedCrypto} data`);
        setLoading(false);
        console.error(err);
      }
    };

    fetchCryptoData();
  }, [selectedCrypto, selectedInterval]);

  // Update chart dimensions on window resize
  useEffect(() => {
    const updateDimensions = () => {
      if (chartContainerRef.current) {
        chartWidth.current = chartContainerRef.current.clientWidth;
        chartHeight.current = 300;
        volumeHeight.current = 120;

        // Re-render with new dimensions
        if (cryptoData) {
          const basePrice = cryptoData.market_data.current_price.usd;
          generateMockData(basePrice);
        }
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, [cryptoData]);

  // Generate realistic mock data for visualization
  const generateMockData = (basePrice) => {
    const numCandles = 100;
    const mockCandles = [];
    const mockVolumes = [];

    // Create initial price and volatility
    let prevClose = basePrice;
    const volatility = basePrice * 0.005; // 0.5% volatility

    // Generate candles
    for (let i = 0; i < numCandles; i++) {
      // Random price movement
      const changePercent = (Math.random() - 0.5) * 0.01;
      const open = prevClose;
      const close = open * (1 + changePercent);
      const high = Math.max(open, close) * (1 + Math.random() * 0.003);
      const low = Math.min(open, close) * (1 - Math.random() * 0.003);
      const isGreen = close >= open;

      // Random volume
      const volume = Math.random() * 100;

      // Position on chart (accounting for right padding)
      const xPos = (i / numCandles) * (chartWidth.current - 80);

      // Add vertical line at specific position (around 1/5 of the chart)
      const hasVerticalLine = i === Math.floor(numCandles / 5);

      // Create date for this candle
      const date = new Date();
      date.setDate(date.getDate() - (numCandles - i) * getIntervalDays());

      mockCandles.push({
        open,
        high,
        low,
        close,
        isGreen,
        xPos,
        hasVerticalLine,
        date,
      });

      mockVolumes.push({
        volume,
        isGreen,
        xPos,
        date,
      });

      prevClose = close;
    }

    setCandleData(mockCandles);
    setVolumeData(mockVolumes);
  };

  // Get days for selected interval
  const getIntervalDays = () => {
    switch (selectedInterval) {
      case "1H":
        return 1 / 24;
      case "2H":
        return 1 / 12;
      case "4H":
        return 1 / 6;
      case "1D":
        return 1;
      case "1W":
        return 7;
      case "1M":
        return 30;
      default:
        return 1;
    }
  };

  // Format price with commas
  const formatPrice = (price) => {
    return price
      ? price.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : "0.00";
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Format time
  const formatTime = (date) => {
    if (!date) return "";
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate min and max prices for scaling
  const getPriceRange = () => {
    if (!candleData.length) return { min: 0, max: 0 };

    const allPrices = candleData.flatMap((candle) => [candle.high, candle.low]);
    const min = Math.min(...allPrices) * 0.9995;
    const max = Math.max(...allPrices) * 1.0005;

    return { min, max };
  };

  // Convert price to Y position
  const priceToY = (price) => {
    const { min, max } = getPriceRange();
    const range = max - min;
    if (range === 0) return 0;

    return chartHeight.current - ((price - min) / range) * chartHeight.current;
  };

  // Convert volume to height
  const volumeToHeight = (volume) => {
    const maxVolume = Math.max(...volumeData.map((v) => v.volume));
    return (volume / maxVolume) * volumeHeight.current;
  };

  // Handle mouse move on chart
  const handleMouseMove = (e) => {
    if (!chartRef.current || !candleData.length) return;

    const rect = chartRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mousePositionRef.current = { x, y };

    // Find the closest candle
    const candleWidth = (chartWidth.current - 80) / candleData.length;
    const index = Math.min(Math.floor(x / candleWidth), candleData.length - 1);

    if (index >= 0 && index < candleData.length) {
      setHoveredCandle(candleData[index]);
      setHoveredIndex(index);
    }
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    setHoveredCandle(null);
    setHoveredIndex(null);
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Change cryptocurrency
  const changeCrypto = (cryptoId) => {
    setSelectedCrypto(cryptoId);
    setShowCoinSelector(false);
  };

  // Get current crypto
  const getCurrentCrypto = () => {
    return (
      availableCryptos.find((crypto) => crypto.id === selectedCrypto) ||
      availableCryptos[0]
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        Loading {getCurrentCrypto().name} data...
      </div>
    );
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  // Get current price and stats
  const currentPrice = cryptoData?.market_data?.current_price?.usd || 36401.64;
  const priceChange =
    cryptoData?.market_data?.price_change_percentage_24h || 2.33;
  const amplitude = 0.99;

  // Calculate OHLC values
  const openPrice = candleData.length ? candleData[0].open : currentPrice;
  const highPrice = candleData.length
    ? Math.max(...candleData.map((c) => c.high))
    : currentPrice * 1.01;
  const lowPrice = candleData.length
    ? Math.min(...candleData.map((c) => c.low))
    : currentPrice * 0.99;
  const closePrice = candleData.length
    ? candleData[candleData.length - 1].close
    : currentPrice;

  // Calculate candle width based on chart width and number of candles
  const candleWidth = candleData.length
    ? ((chartWidth.current - 80) / candleData.length) * 0.6
    : 8;

  // Get price range for display
  const { min: minPrice, max: maxPrice } = getPriceRange();

  // Generate price labels
  const priceLabels = [];
  const numLabels = 5;
  for (let i = 0; i < numLabels; i++) {
    const price = minPrice + (maxPrice - minPrice) * (i / (numLabels - 1));
    priceLabels.push(formatPrice(price));
  }

  // Current crypto
  const currentCrypto = getCurrentCrypto();

  return (
    <>


      <div
        className={`crypto-chart-container ${isFullscreen ? "fullscreen" : ""}`}
      >
        {/* Time interval selector */}
        <div className="time-interval-selector">
          <div className="time-label">Time</div>

          {["1H", "2H", "4H", "1D", "1W", "1M"].map((interval) => (
            <button
              key={interval}
              onClick={() => setSelectedInterval(interval)}
              className={`interval-button ${
                selectedInterval === interval ? "active" : ""
              }`}
            >
              {interval}
            </button>
          ))}

          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <button className="fx-indicators-button">
              Fx Indicators
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                style={{ marginLeft: "4px" }}
              >
                <path
                  d="M6 9l6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Crypto info */}
        <div className="crypto-info">
          {/* Crypto selector */}
          <div className="crypto-selector">
            <div
              className="crypto-selector-button"
              onClick={() => setShowCoinSelector(!showCoinSelector)}
            >
              <div
                className="crypto-symbol-icon"
                style={{ backgroundColor: currentCrypto.color }}
              >
                {currentCrypto.symbol.charAt(0)}
              </div>
              <span style={{ fontWeight: "bold" }}>
                {currentCrypto.symbol}/USD
              </span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 9l6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Dropdown for coin selection */}
            {showCoinSelector && (
              <div className="crypto-dropdown">
                {availableCryptos.map((crypto) => (
                  <div
                    key={crypto.id}
                    onClick={() => changeCrypto(crypto.id)}
                    className={`crypto-dropdown-item ${
                      selectedCrypto === crypto.id ? "active" : ""
                    }`}
                  >
                    <div
                      className="crypto-dropdown-icon"
                      style={{ backgroundColor: crypto.color }}
                    >
                      {crypto.symbol.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: "bold" }}>{crypto.symbol}</div>
                      <div style={{ fontSize: "12px", color: "#9ca3af" }}>
                        {crypto.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="price-indicator" style={{ color: "#00b386" }}>
            O <span className="price-value">{formatPrice(openPrice)}</span>
          </div>

          <div className="price-indicator" style={{ color: "#00b386" }}>
            H <span className="price-value">{formatPrice(highPrice)}</span>
          </div>

          <div className="price-indicator" style={{ color: "#ff5252" }}>
            L <span className="price-value">{formatPrice(lowPrice)}</span>
          </div>

          <div className="price-indicator" style={{ color: "#00b386" }}>
            C <span className="price-value">{formatPrice(closePrice)}</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span>Change:</span>
            <span style={{ color: priceChange >= 0 ? "#00b386" : "#ff5252" }}>
              {priceChange >= 0 ? "+" : ""}
              {priceChange.toFixed(2)}%
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "14px",
            }}
          >
            <span>Amplitude:</span>
            <span style={{ color: "#00b386" }}>{amplitude}%</span>
          </div>
        </div>

        {/* Chart container */}
        <div ref={chartContainerRef} className="chart-container">
          {/* Price labels on the right */}
          <div className="price-labels">
            {priceLabels.map((label, index) => (
              <div key={index} className="price-label">
                {label}
              </div>
            ))}
          </div>

          {/* Main chart area */}
          <div
            ref={chartRef}
            className="chart-area"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {/* Render candles */}
            {candleData.map((candle, index) => {
              const wickTop = priceToY(candle.high);
              const wickBottom = priceToY(candle.low);
              const bodyTop = priceToY(Math.max(candle.open, candle.close));
              const bodyBottom = priceToY(Math.min(candle.open, candle.close));
              const bodyHeight = Math.max(1, bodyBottom - bodyTop);
              const isHighlighted = hoveredIndex === index;

              return (
                <div
                  key={index}
                  className={`candle ${isHighlighted ? "highlighted" : ""}`}
                  style={{ left: `${candle.xPos}px` }}
                  onMouseEnter={() => {
                    setHoveredCandle(candle);
                    setHoveredIndex(index);
                  }}
                >
                  {/* Vertical time indicator line */}
                  {candle.hasVerticalLine && (
                    <div
                      className="vertical-indicator-line"
                      style={{ left: `${candleWidth / 2}px` }}
                    />
                  )}

                  {/* Candle wick */}
                  <div
                    className={`candle-wick ${candle.isGreen ? "" : "red"} ${
                      isHighlighted ? "highlighted" : ""
                    }`}
                    style={{
                      top: `${wickTop}px`,
                      left: `${candleWidth / 2}px`,
                      height: `${wickBottom - wickTop}px`,
                      opacity: isHighlighted
                        ? "1"
                        : hoveredIndex !== null
                        ? "0.5"
                        : "1",
                    }}
                  />

                  {/* Candle body */}
                  <div
                    className={`candle-body ${candle.isGreen ? "" : "red"} ${
                      isHighlighted ? "highlighted" : ""
                    }`}
                    style={{
                      top: `${bodyTop}px`,
                      left: isHighlighted ? "-1px" : "0",
                      width: isHighlighted
                        ? `${candleWidth + 2}px`
                        : `${candleWidth}px`,
                      height: `${bodyHeight}px`,
                      opacity: isHighlighted
                        ? "1"
                        : hoveredIndex !== null
                        ? "0.5"
                        : "1",
                    }}
                  />
                </div>
              );
            })}

            {/* Current price line */}
            <div
              className="current-price-line"
              style={{ top: `${priceToY(currentPrice)}px` }}
            />

            {/* Current price label */}
            <div
              className="current-price-label"
              style={{ top: `${priceToY(currentPrice)}px` }}
            >
              {formatPrice(currentPrice)}
            </div>

            {/* Hover crosshair - vertical line */}
            {hoveredCandle && (
              <div
                className="hover-vertical-line"
                style={{ left: `${mousePositionRef.current.x}px` }}
              />
            )}

            {/* Hover crosshair - horizontal line */}
            {hoveredCandle && (
              <div
                className="hover-horizontal-line"
                style={{ top: `${mousePositionRef.current.y}px` }}
              />
            )}

            {/* Hover tooltip */}
            {hoveredCandle && (
              <div
                className="hover-tooltip"
                style={{
                  left:
                    mousePositionRef.current.x < (chartWidth.current - 80) / 2
                      ? mousePositionRef.current.x + 20
                      : mousePositionRef.current.x - 150,
                  top:
                    mousePositionRef.current.y < 100
                      ? mousePositionRef.current.y + 10
                      : mousePositionRef.current.y - 110,
                }}
              >
                <div className="tooltip-header">
                  {formatDate(hoveredCandle.date)}{" "}
                  {formatTime(hoveredCandle.date)}
                </div>
                <div className="tooltip-row">
                  <span className="tooltip-label">Open:</span>
                  <span className="tooltip-value">
                    {formatPrice(hoveredCandle.open)}
                  </span>
                </div>
                <div className="tooltip-row">
                  <span className="tooltip-label">High:</span>
                  <span className="tooltip-value green">
                    {formatPrice(hoveredCandle.high)}
                  </span>
                </div>
                <div className="tooltip-row">
                  <span className="tooltip-label">Low:</span>
                  <span className="tooltip-value red">
                    {formatPrice(hoveredCandle.low)}
                  </span>
                </div>
                <div className="tooltip-row">
                  <span className="tooltip-label">Close:</span>
                  <span className="tooltip-value">
                    {formatPrice(hoveredCandle.close)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Volume info */}
          <div className="volume-info">
            <div>
              Vol({currentCrypto.symbol}):{" "}
              <span className="volume-label">65,534K</span>
            </div>
            <div>
              Val(USDT): <span className="volume-label">2,188</span>
            </div>
          </div>

          {/* Volume labels on the right */}
          <div className="volume-labels">
            {[0, 1, 2, 3].map((index) => (
              <div key={index} className="volume-label-item">
                {index === 0
                  ? "120"
                  : index === 1
                  ? "80"
                  : index === 2
                  ? "40"
                  : "0"}
              </div>
            ))}
          </div>

          {/* Volume chart */}
          <div ref={volumeRef} className="volume-chart">
            {/* Render volume bars */}
            {volumeData.map((vol, index) => {
              const barHeight = volumeToHeight(vol.volume);
              const isHighlighted = hoveredIndex === index;

              return (
                <div
                  key={index}
                  className={`volume-bar ${vol.isGreen ? "" : "red"} ${
                    isHighlighted ? "highlighted" : ""
                  }`}
                  style={{
                    left: `${vol.xPos}px`,
                    width: isHighlighted
                      ? `${candleWidth + 2}px`
                      : `${candleWidth}px`,
                    height: `${barHeight}px`,
                    opacity: isHighlighted
                      ? "1"
                      : hoveredIndex !== null
                      ? "0.3"
                      : "1",
                  }}
                  onMouseEnter={() => {
                    setHoveredCandle(candleData[index]);
                    setHoveredIndex(index);
                  }}
                />
              );
            })}

            {/* Hover vertical line on volume chart */}
            {hoveredCandle && (
              <div
                className="hover-vertical-line"
                style={{ left: `${mousePositionRef.current.x}px` }}
              />
            )}
          </div>

          {/* Date labels with distinct vertical grid lines */}
          <div className="date-labels">
            {[
              "02/21",
              "03/14",
              "03/28",
              "04/04",
              "04/11",
              "04/18",
              "04/25",
              "05/02",
              "05/09",
              "05/16",
              "05/23",
            ].map((date, index, dates) => (
              <div key={index} className="date-label-container">
                <div className="date-grid-line"></div>
                <div className="date-label">{date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
