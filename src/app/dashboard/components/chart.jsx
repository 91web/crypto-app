"use client";

import { useEffect, useState, useRef } from "react";

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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#111827",
          color: "white",
          //  fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        Loading {getCurrentCrypto().name} data...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",

          backgroundColor: "#111827",
          color: "white",
          // fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {error}
      </div>
    );
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
    <div
      style={{
        backgroundColor: "#111827",
        color: "white",
        width: "100%",
        height: isFullscreen ? "100vh" : "auto",
        //fontFamily: "system-ui, -apple-system, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Time interval selector */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <div
          style={{
            color: "#9ca3af",
            marginRight: "16px",
            fontSize: "14px",
          }}
        >
          Time
        </div>

        {["1H", "2H", "4H", "1D", "1W", "1M"].map((interval) => (
          <button
            key={interval}
            onClick={() => setSelectedInterval(interval)}
            style={{
              backgroundColor:
                selectedInterval === interval ? "#374151" : "transparent",
              color: "white",
              border: "none",
              borderRadius: "4px",
              padding: "4px 8px",
              marginRight: "8px",
              cursor: "pointer",
              fontSize: "12px",
              transition: "background-color 0.2s",
            }}
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
          <button
            style={{
              backgroundColor: "#374151",
              color: "white",
              border: "none",
              marginTop: "4px",
              borderRadius: "4px",
              padding: "4px 8px",
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              fontSize: "12px",
              transition: "background-color 0.2s",
            }}
          >
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "16px",
          paddingBottom: "8px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        {/* Crypto selector */}
        <div
          style={{
            position: "relative",
          }}
        >
          <div
            onClick={() => setShowCoinSelector(!showCoinSelector)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
              padding: "4px 8px",
              borderRadius: "4px",
              backgroundColor: "#1f2937",
              transition: "background-color 0.2s",
            }}
          >
            <div
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                backgroundColor: currentCrypto.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "12px",
              }}
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
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: "0",
                backgroundColor: "#1f2937",
                borderRadius: "4px",
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                zIndex: "10",
                marginTop: "4px",
                width: "100px",
              }}
            >
              {availableCryptos.map((crypto) => (
                <div
                  key={crypto.id}
                  onClick={() => changeCrypto(crypto.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 12px",
                    cursor: "pointer",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                    transition: "background-color 0.2s",
                    backgroundColor:
                      selectedCrypto === crypto.id ? "#374151" : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#374151";
                  }}
                  onMouseLeave={(e) => {
                    if (selectedCrypto !== crypto.id) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      backgroundColor: crypto.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontWeight: "bold",
                      fontSize: "10px",
                    }}
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

        <div
          style={{
            color: "#00b386",
            fontWeight: "500",
            fontSize: "14px",
          }}
        >
          O{" "}
          <span style={{ fontWeight: "medium", fontSize: { xs: 10, md: 14 } }}>
            {formatPrice(openPrice)}
          </span>
        </div>

        <div
          style={{
            color: "#00b386",
            fontWeight: "500",
            fontSize: { xs: "10px", md: "14px" },
          }}
        >
          H{" "}
          <span style={{ fontWeight: "medium", fontSize: { xs: 10, md: 14 } }}>
            {formatPrice(highPrice)}
          </span>
        </div>

        <div
          style={{
            color: "#ff5252",
            fontWeight: "500",
            fontSize: { xs: "10px", md: "14px" },
          }}
        >
          L{" "}
          <span style={{ fontWeight: "medium", fontSize: { xs: 10, md: 14 } }}>
            {formatPrice(lowPrice)}
          </span>
        </div>

        <div
          style={{
            color: "#00b386",
            fontWeight: "500",
            fontSize: { xs: "10px", md: "14px" },
          }}
        >
          C{" "}
          <span style={{ fontWeight: "medium", fontSize: { xs: 10, md: 14 } }}>
            {formatPrice(closePrice)}
          </span>
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
            fontSize: { xs: "10px", md: "14px" },
          }}
        >
          <span>Amplitude:</span>
          <span style={{ color: "#00b386" }}>{amplitude}%</span>
        </div>
      </div>

      {/* Chart container */}
      <div
        ref={chartContainerRef}
        style={{
          position: "relative",
          height: "420px",
          width: "100%",
          marginBottom: "16px",
        }}
      >
        {/* Price labels on the right */}
        <div
          style={{
            position: "absolute",
            right: "0",
            top: "0",
            height: "300px",
            width: "80px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            zIndex: "2",
          }}
        >
          {priceLabels.map((label, index) => (
            <div
              key={index}
              style={{
                color: "#9ca3af",
                fontSize: "12px",
                textAlign: "right",
                paddingRight: "8px",
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Main chart area */}
        <div
          ref={chartRef}
          style={{
            position: "relative",
            height: "300px",
            width: "calc(100% - 80px)",
            marginRight: "80px",
            borderBottom: "1px dashed rgba(255, 255, 255, 0.1)",
            cursor: "crosshair",
          }}
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
                style={{
                  position: "absolute",
                  left: `${candle.xPos}px`,
                  zIndex: isHighlighted ? "3" : "1",
                }}
                onMouseEnter={() => {
                  setHoveredCandle(candle);
                  setHoveredIndex(index);
                }}
              >
                {/* Vertical time indicator line */}
                {candle.hasVerticalLine && (
                  <div
                    style={{
                      position: "absolute",
                      top: "0",
                      left: `${candleWidth / 2}px`,
                      width: "1px",
                      height: "420px", // Full height including volume
                      backgroundColor: "rgba(255, 255, 255, 0.3)",
                      zIndex: "1",
                    }}
                  />
                )}

                {/* Candle wick */}
                <div
                  style={{
                    position: "absolute",
                    top: `${wickTop}px`,
                    left: `${candleWidth / 2}px`,
                    width: isHighlighted ? "2px" : "1px",
                    height: `${wickBottom - wickTop}px`,
                    backgroundColor: candle.isGreen ? "#00b386" : "#ff5252",
                    opacity: isHighlighted
                      ? "1"
                      : hoveredIndex !== null
                      ? "0.5"
                      : "1",
                    transition: "opacity 0.1s, width 0.1s",
                  }}
                />

                {/* Candle body */}
                <div
                  style={{
                    position: "absolute",
                    top: `${bodyTop}px`,
                    left: isHighlighted ? "-1px" : "0",
                    width: isHighlighted
                      ? `${candleWidth + 2}px`
                      : `${candleWidth}px`,
                    height: `${bodyHeight}px`,
                    backgroundColor: candle.isGreen ? "#00b386" : "#ff5252",
                    opacity: isHighlighted
                      ? "1"
                      : hoveredIndex !== null
                      ? "0.5"
                      : "1",
                    transition: "opacity 0.1s, width 0.1s, left 0.1s",
                    boxShadow: isHighlighted
                      ? "0 0 8px rgba(255, 255, 255, 0.3)"
                      : "none",
                  }}
                />
              </div>
            );
          })}

          {/* Current price line */}
          <div
            style={{
              position: "absolute",
              left: "0",
              right: "0",
              top: `${priceToY(currentPrice)}px`,
              height: "1px",
              backgroundColor: "#00b386",
              zIndex: "2",
            }}
          />

          {/* Current price label */}
          <div
            style={{
              position: "absolute",
              right: "0",
              top: `${priceToY(currentPrice)}px`,
              transform: "translateY(-50%)",
              backgroundColor: "#00b386",
              color: "white",
              padding: "2px 6px",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: "bold",
              zIndex: "3",
            }}
          >
            {formatPrice(currentPrice)}
          </div>

          {/* Hover crosshair - vertical line */}
          {hoveredCandle && (
            <div
              style={{
                position: "absolute",
                top: "0",
                left: `${mousePositionRef.current.x}px`,
                width: "1px",
                height: "100%",
                backgroundColor: "rgba(255, 255, 255, 0.3)",
                zIndex: "2",
              }}
            />
          )}

          {/* Hover crosshair - horizontal line */}
          {hoveredCandle && (
            <div
              style={{
                position: "absolute",
                top: `${mousePositionRef.current.y}px`,
                left: "0",
                width: "100%",
                height: "1px",
                backgroundColor: "rgba(255, 255, 255, 0.3)",
                zIndex: "2",
              }}
            />
          )}

          {/* Hover tooltip */}
          {hoveredCandle && (
            <div
              style={{
                position: "absolute",
                left:
                  mousePositionRef.current.x < (chartWidth.current - 80) / 2
                    ? mousePositionRef.current.x + 20
                    : mousePositionRef.current.x - 150,
                top:
                  mousePositionRef.current.y < 100
                    ? mousePositionRef.current.y + 10
                    : mousePositionRef.current.y - 110,
                backgroundColor: "rgba(31, 41, 55, 0.95)",
                padding: "12px",
                borderRadius: "4px",
                fontSize: "12px",
                zIndex: "20",
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                minWidth: "120px",
              }}
            >
              <div
                style={{
                  marginBottom: "8px",
                  fontWeight: "bold",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                  paddingBottom: "4px",
                }}
              >
                {formatDate(hoveredCandle.date)}{" "}
                {formatTime(hoveredCandle.date)}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "4px",
                }}
              >
                <span style={{ color: "#9ca3af" }}>Open:</span>
                <span style={{ fontWeight: "bold" }}>
                  {formatPrice(hoveredCandle.open)}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "4px",
                }}
              >
                <span style={{ color: "#9ca3af" }}>High:</span>
                <span style={{ fontWeight: "bold", color: "#00b386" }}>
                  {formatPrice(hoveredCandle.high)}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "4px",
                }}
              >
                <span style={{ color: "#9ca3af" }}>Low:</span>
                <span style={{ fontWeight: "bold", color: "#ff5252" }}>
                  {formatPrice(hoveredCandle.low)}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#9ca3af" }}>Close:</span>
                <span style={{ fontWeight: "bold" }}>
                  {formatPrice(hoveredCandle.close)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Volume info */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            marginTop: "8px",
            marginBottom: "4px",
            fontSize: "12px",
            color: "#9ca3af",
          }}
        >
          <div>
            Vol({currentCrypto.symbol}):{" "}
            <span style={{ color: "#ff5252" }}>65,534K</span>
          </div>
          <div>
            Val(USDT): <span style={{ color: "#ff5252" }}>2,188</span>
          </div>
        </div>

        {/* Volume labels on the right */}
        <div
          style={{
            position: "absolute",
            right: "0",
            top: "330px",
            height: "90px",
            width: "80px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            zIndex: "1",
          }}
        >
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              style={{
                color: "#9ca3af",
                fontSize: "12px",
                textAlign: "right",
                paddingRight: "8px",
              }}
            >
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
        <div
          ref={volumeRef}
          style={{
            position: "relative",
            height: "90px",
            width: "calc(100% - 80px)",
            marginRight: "80px",
            marginTop: "8px",
          }}
        >
          {/* Render volume bars */}
          {volumeData.map((vol, index) => {
            const barHeight = volumeToHeight(vol.volume);
            const isHighlighted = hoveredIndex === index;

            return (
              <div
                key={index}
                style={{
                  position: "absolute",
                  bottom: "0",
                  left: `${vol.xPos}px`,
                  width: isHighlighted
                    ? `${candleWidth + 2}px`
                    : `${candleWidth}px`,
                  height: `${barHeight}px`,
                  backgroundColor: vol.isGreen ? "#00b386" : "#ff5252",
                  opacity: isHighlighted
                    ? "1"
                    : hoveredIndex !== null
                    ? "0.3"
                    : "1",
                  transition: "opacity 0.1s, width 0.1s",
                  boxShadow: isHighlighted
                    ? "0 0 8px rgba(255, 255, 255, 0.2)"
                    : "none",
                  zIndex: isHighlighted ? "3" : "1",
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
              style={{
                position: "absolute",
                top: "0",
                left: `${mousePositionRef.current.x}px`,
                width: "1px",
                height: "100%",
                backgroundColor: "rgba(255, 255, 255, 0.3)",
                zIndex: "2",
              }}
            />
          )}
        </div>

        {/* Date labels with distinct vertical grid lines */}
        <div
          style={{
            position: "absolute",
            bottom: "0",
            marginBottom: "-15px",
            left: "0",
            right: "80px", // Account for right padding
            display: "flex",
            justifyContent: "space-between",
            color: "#9ca3af",
            fontSize: "10px",
            paddingTop: "4px",
          }}
        >
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
            <div
              key={index}
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width:
                  index === 0
                    ? "auto"
                    : index === dates.length - 1
                    ? "auto"
                    : "100%",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  bottom: "16px", // Position above the text
                  height: "420px", // Extend up through the chart
                  width: "1px",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  zIndex: "1",
                }}
              ></div>
              <div
                style={{
                  position: "relative",
                  zIndex: "2",
                  backgroundColor: "#111827",
                  padding: "0 4px",
                }}
              >
                {date}
              </div>
            </div>
          ))}
        </div>
      </div>
 
    </div>
  );
}
