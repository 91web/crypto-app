"use client";

import { useState, useEffect } from "react";

// Styles object for reusable styles
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: "1100px",
    padding: "5px",
    gap: "8px",
    backgroundColor: "#000",
    color: "white",
  },
  containerDesktop: {
    flexDirection: "row",
  },
  panel1: {
    width: "100%",
    backgroundColor: "#1F2937",
    borderRadius: "8px",
    padding: "10px",
    height: "auto", // Changed from fixed height to auto
    minHeight: "400px", // Minimum height for mobile
    overflow: "hidden", 
    marginBottom: "20px"
  },
  panel2: {
    width: "100%",
    backgroundColor: "#1F2937",
    borderRadius: "8px",
    padding: "10px",
    height: "auto", // Changed from fixed height to auto
    minHeight: "400px", // Minimum height for mobile
    overflow: "hidden", // Add scroll if content overflows
    marginBottom: "20px", 
  },
  tabButton: {
    padding: "8px 16px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "transparent",
    color: "white",
    cursor: "pointer",
  },
  activeTabButton: {
    backgroundColor: "#374151",
  },
  flexRow: {
    display: "flex",
    gap: "8px",
    marginBottom: "16px",
    padding: "2px",
    // width: "150px",
    fontSize: "12px",
  },
  flexBetween: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "12px",
  },
  gridHeader: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "16px",
    marginBottom: "8px",
    fontSize: "14px",
    color: "#9CA3AF",
  },
  gridRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "16px",
    padding: "4px 0",
  },
  orangeText: {
    color: "#F97316",
    fontSize: "12px",
  },
  greenText: {
    color: "#4ADE80",
    fontSize: "12px",
  },
  totalSection: {
    marginTop: "16px",
    paddingTop: "8px",
    borderTop: "1px solid #374151",
    display: "flex",
    justifyContent: "space-between",
    fontWeight: "500",
    fontSize: "12px",
  },
  greenRow: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
  },
  orderTypeButton: {
    padding: "8px 16px",
    border: "none",
    margin: "4px",
    backgroundColor: "transparent",
    color: "white",
    borderRadius: "4px",
    cursor: "pointer",
  },
  activeOrderTypeButton: {
    backgroundColor: "#374151",
  },
  inputContainer: {
    backgroundColor: "#374151",
    borderRadius: "4px",
    padding: "12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  input: {
    backgroundColor: "transparent",
    border: "none",
    color: "white",
    textAlign: "right",
    width: "100px",
    outline: "none",
  },
  checkboxContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: "16px",
  },
  checkbox: {
    width: "20px",
    height: "20px",
    borderRadius: "4px",
    backgroundColor: "#3B82F6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "8px",
  },
  buyButton: {
    width: "100%",
    padding: "12px",
    borderRadius: "4px",
    border: "none",
    background:
      "linear-gradient(90deg, #483BEB 0%, #7847E1 47.92%, #DD568D 96.35%)",
    color: "white",
    fontWeight: "500",
    cursor: "pointer",
    marginBottom: "16px",
  },
  depositButton: {
    padding: "8px 32px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#3B82F6",
    color: "white",
    fontWeight: "500",
    cursor: "pointer",
    marginTop: "16px",
  },
  infoIcon: {
    width: "16px",
    height: "16px",
    marginLeft: "4px",
    opacity: "0.7",
  },
  dropdown: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
  dropdownIcon: {
    width: "16px",
    height: "16px",
    marginLeft: "4px",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    marginTop: "16px",
  },
  label: {
    fontSize: "14px",
    color: "#9CA3AF",
  },
  orderTypeDropdown: {
    position: "relative",
  },
  dropdownMenu: {
    position: "absolute",
    top: "100%",
    right: "0",
    backgroundColor: "#374151",
    borderRadius: "4px",
    padding: "8px 0",
    zIndex: "10",
    width: "200px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  dropdownItem: {
    padding: "8px 16px",
    cursor: "pointer",
  },
  dropdownItemHover: {
    backgroundColor: "#4B5563",
  },
  sellButton: {
    padding: "8px 24px",
    borderRadius: "4px",
    border: "1px solid #EF4444",
    backgroundColor: "transparent",
    color: "white",
    cursor: "pointer",
  },
  buyTabButton: {
    padding: "8px 24px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "transparent",
    color: "white",
    cursor: "pointer",
  },
  orderTypeSelector: {
    display: "flex",
    marginBottom: "16px",
    fontSize: "12px",
  },
  orderTypeSelectorLeft: {
    borderTopLeftRadius: "4px",
    borderBottomLeftRadius: "4px",
  },
  orderTypeSelectorRight: {
    borderTopRightRadius: "8px",

    borderBottomRightRadius: "4px",
  },
};

// Mock data for when API fails
const MOCK_COINS = [
  {
    id: "bitcoin",
    symbol: "btc",
    name: "Bitcoin",
    market_data: {
      current_price: {
        usd: 36920.12,
      },
    },
  },
  {
    id: "ethereum",
    symbol: "eth",
    name: "Ethereum",
    market_data: {
      current_price: {
        usd: 2450.75,
      },
    },
  },
  {
    id: "ripple",
    symbol: "xrp",
    name: "XRP",
    market_data: {
      current_price: {
        usd: 0.58,
      },
    },
  },
];

// Mock order book data
const generateMockOrderBook = (basePrice = 36920.12) => {
  const orders = [];

  // Generate sell orders (displayed at the top)
  for (let i = 0; i < 5; i++) {
    const price = basePrice + basePrice * 0.0005 * (5 - i);
    orders.push({
      price: price.toFixed(2),
      amount: "0.758965",
      total: (price * 0.758965).toFixed(2),
    });
  }

  // Generate buy orders (displayed at the bottom)
  for (let i = 0; i < 6; i++) {
    const price = basePrice - basePrice * 0.0005 * i;
    orders.push({
      price: price.toFixed(2),
      amount: "0.758965",
      total: (price * 0.758965).toFixed(2),
    });
  }

  return orders;
};

// Info icon component
const InfoIcon = () => (
  <svg
    style={styles.infoIcon}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

// Dropdown icon component
const ChevronDownIcon = () => (
  <svg
    style={styles.dropdownIcon}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

// Checkmark icon component
const CheckmarkIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    stroke="currentColor"
    strokeWidth="3"
    fill="none"
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export default function CryptoTrading() {
  const [coins, setCoins] = useState(MOCK_COINS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("orderBook");
  const [orderType, setOrderType] = useState("Limit");
  const [orderTypeDropdown, setOrderTypeDropdown] = useState(
    "Good till cancelled"
  );
  const [showOrderTypeDropdown, setShowOrderTypeDropdown] = useState(false);
  const [postOnly, setPostOnly] = useState(true);
  const [limitPrice, setLimitPrice] = useState("0.00");
  const [amount, setAmount] = useState("0.00");
  const [selectedCoin, setSelectedCoin] = useState(MOCK_COINS[0]);
  const [displayCount, setDisplayCount] = useState(10);
  const [showDisplayCountDropdown, setShowDisplayCountDropdown] =
    useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [buyMode, setBuyMode] = useState(true);
  const [orderBookData, setOrderBookData] = useState([]);

  // Check if window width is desktop
  useEffect(() => {
    const checkIfDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    checkIfDesktop();
    window.addEventListener("resize", checkIfDesktop);

    return () => {
      window.removeEventListener("resize", checkIfDesktop);
    };
  }, []);

  // Initialize with mock data and try to fetch real data
  useEffect(() => {
    // Set initial mock data
    setSelectedCoin(MOCK_COINS[0]);
    setOrderBookData(
      generateMockOrderBook(MOCK_COINS[0].market_data.current_price.usd)
    );

    // Set initial price from mock data
    setLimitPrice(MOCK_COINS[0].market_data.current_price.usd.toFixed(2));

    const fetchCoins = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try to fetch from CoinGecko API
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1"
        );

        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();

        // Check if data is an array before using array methods
        if (Array.isArray(data) && data.length > 0) {
          // Transform the data to match our expected format
          const formattedData = data.map((coin) => ({
            id: coin.id,
            symbol: coin.symbol,
            name: coin.name,
            market_data: {
              current_price: {
                usd: coin.current_price,
              },
            },
          }));

          setCoins(formattedData);

          // Find BTC or use the first coin
          const btcCoin = formattedData.find(
            (coin) =>
              coin.symbol?.toLowerCase() === "btc" ||
              coin.id?.toLowerCase() === "bitcoin"
          );

          const selectedCoin = btcCoin || formattedData[0];
          setSelectedCoin(selectedCoin);

          // Update order book with the new price
          setOrderBookData(
            generateMockOrderBook(selectedCoin.market_data.current_price.usd)
          );

          // Update limit price
          setLimitPrice(selectedCoin.market_data.current_price.usd.toFixed(2));
        } else {
          console.log("Using mock data because API did not return valid data");
          // Keep using mock data
        }
      } catch (error) {
        console.log(
          "Using mock data because API request failed:",
          error.message
        );
        // Keep using mock data, no need to set error state since we have fallbacks
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();

    // Simulate price updates every 5 seconds
    const interval = setInterval(() => {
      setOrderBookData((prevData) => {
        const basePrice = selectedCoin.market_data.current_price.usd;
        // Add small random fluctuations to make it look like real trading
        const randomFactor = 1 + (Math.random() * 0.002 - 0.001); // ±0.1% change
        return generateMockOrderBook(basePrice * randomFactor);
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Calculate total based on price and amount
  const calculateTotal = () => {
    const price = Number.parseFloat(limitPrice) || 0;
    const amt = Number.parseFloat(amount) || 0;
    return (price * amt).toFixed(2);
  };

  // Order type options
  const orderTypeOptions = [
    "Good till cancelled",
    "Immediate or cancel",
    "Fill or kill",
    "Post only",
  ];

  // Display count options
  const displayCountOptions = [5, 10, 15, 20, 25];

  // Toggle order type dropdown
  const toggleOrderTypeDropdown = () => {
    setShowOrderTypeDropdown(!showOrderTypeDropdown);
  };

  // Toggle display count dropdown
  const toggleDisplayCountDropdown = () => {
    setShowDisplayCountDropdown(!showDisplayCountDropdown);
  };

  // Select order type
  const selectOrderType = (type) => {
    setOrderTypeDropdown(type);
    setShowOrderTypeDropdown(false);
  };

  // Select display count
  const selectDisplayCount = (count) => {
    setDisplayCount(count);
    setShowDisplayCountDropdown(false);
  };

  // Handle buy/sell mode toggle
  const toggleBuySellMode = (isBuy) => {
    setBuyMode(isBuy);
  };

  // Get the top and bottom parts of the order book
  const topOrderBook = orderBookData.slice(0, 5);
  const bottomOrderBook = orderBookData.slice(5);

  return (
    <div
      style={{
        ...styles.container,
        ...(isDesktop ? styles.containerDesktop : {}),
      }}
    >
      {/* Left side - Order Book */}
      <div style={styles.panel1}>
        <div style={styles.flexRow}>
          <button
            style={{
              ...styles.tabButton,
              ...(activeTab === "orderBook" ? styles.activeTabButton : {}),
            }}
            onClick={() => setActiveTab("orderBook")}
          >
            Order Book
          </button>
          <button
            style={{
              ...styles.tabButton,
              ...(activeTab === "recentTrades" ? styles.activeTabButton : {}),
            }}
            onClick={() => setActiveTab("recentTrades")}
          >
            Recent trades
          </button>
        </div>

        <div style={styles.flexBetween}>
          <div style={styles.flexRow}>
            <button
              style={{
                padding: "4px",
                borderRadius: "4px",
                backgroundColor: "#374151",
              }}
            >
              <div
                style={{ display: "flex", flexDirection: "column", gap: "4px" }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "2px",
                    backgroundColor: "#4ADE80",
                  }}
                ></span>
                <span
                  style={{
                    width: "16px",
                    height: "2px",
                    backgroundColor: "#4ADE80",
                  }}
                ></span>
                <span
                  style={{
                    width: "16px",
                    height: "2px",
                    backgroundColor: "#4ADE80",
                  }}
                ></span>
              </div>
            </button>
            <button
              style={{
                padding: "4px",
                borderRadius: "4px",
                backgroundColor: "#374151",
              }}
            >
              <div
                style={{ display: "flex", flexDirection: "column", gap: "4px" }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "2px",
                    backgroundColor: "#9CA3AF",
                  }}
                ></span>
                <span
                  style={{
                    width: "16px",
                    height: "2px",
                    backgroundColor: "#9CA3AF",
                  }}
                ></span>
                <span
                  style={{
                    width: "16px",
                    height: "2px",
                    backgroundColor: "#9CA3AF",
                  }}
                ></span>
              </div>
            </button>
            <button
              style={{
                padding: "4px",
                borderRadius: "4px",
                backgroundColor: "#374151",
              }}
            >
              <div
                style={{ display: "flex", flexDirection: "column", gap: "4px" }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "2px",
                    backgroundColor: "#EF4444",
                  }}
                ></span>
                <span
                  style={{
                    width: "16px",
                    height: "2px",
                    backgroundColor: "#EF4444",
                  }}
                ></span>
                <span
                  style={{
                    width: "16px",
                    height: "2px",
                    backgroundColor: "#EF4444",
                  }}
                ></span>
              </div>
            </button>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#374151",
              borderRadius: "4px",
              padding: "4px 8px",
              cursor: "pointer",
              position: "relative",
            }}
            onClick={toggleDisplayCountDropdown}
          >
            <span>{displayCount}</span>
            <ChevronDownIcon />

            {showDisplayCountDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  right: "0",
                  backgroundColor: "#374151",
                  borderRadius: "4px",
                  padding: "8px 0",
                  zIndex: "10",
                  width: "100px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              >
                {displayCountOptions.map((count) => (
                  <div
                    key={count}
                    style={{
                      padding: "8px 16px",
                      cursor: "pointer",
                      backgroundColor:
                        displayCount === count ? "#4B5563" : "transparent",
                    }}
                    onClick={() => selectDisplayCount(count)}
                  >
                    {count}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={styles.gridHeader}>
          <div>
            Price
            <div style={{ fontSize: "12px" }}>(USDT)</div>
          </div>
          <div>
            Amounts
            <div style={{ fontSize: "12px" }}>(BTC)</div>
          </div>
          <div>Total</div>
        </div>

        {/* Top order book entries (sell orders) */}
        <div>
          {topOrderBook.map((order, index) => (
            <div key={index} style={styles.gridRow}>
              <div style={styles.orangeText}>{order.price}</div>
              <div style={{ fontSize: "12px" }}>{order.amount}</div>
              <div style={{ fontSize: "12px" }}>{order.total}</div>
            </div>
          ))}
        </div>

        {/* Total section */}
        <div style={styles.totalSection}>
          <div style={styles.greenText}>36,641.20 ↑</div>
          <div style={{ fontSize: "12px" }}>36,641.20</div>
        </div>

        {/* Bottom order book entries (buy orders) */}
        <div style={{ marginTop: "16px" }}>
          {bottomOrderBook.map((order, index) => (
            <div
              key={`bottom-${index}`}
              style={{
                ...styles.gridRow,
                ...(index % 2 === 0 ? styles.greenRow : {}),
              }}
            >
              <div style={styles.greenText}>{order.price}</div>
              <div style={{ fontSize: "12px" }}>{order.amount}</div>
              <div style={{ fontSize: "12px" }}>{order.total}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right side - Trading Form */}
      <div style={styles.panel2}>
        <div style={styles.flexBetween}>
          <button
            style={{
              ...styles.buyTabButton,
              backgroundColor: buyMode ? "#374151" : "transparent",
            }}
            onClick={() => toggleBuySellMode(true)}
          >
            Buy
          </button>
          <button
            style={styles.sellButton}
            onClick={() => toggleBuySellMode(false)}
          >
            Sell
          </button>
        </div>

        <div style={styles.orderTypeSelector}>
          <button
            style={{
              ...styles.orderTypeButton,
              ...styles.orderTypeSelectorLeft,
              ...(orderType === "Limit" ? styles.activeOrderTypeButton : {}),
              fontSize: "12px",
            }}
            onClick={() => setOrderType("Limit")}
          >
            Limit
          </button>
          <button
            style={{
              ...styles.orderTypeButton,
              ...(orderType === "Market" ? styles.activeOrderTypeButton : {}),
              fontSize: "12px",
            }}
            onClick={() => setOrderType("Market")}
          >
            Market
          </button>
          <button
            style={{
              ...styles.orderTypeButton,
              ...styles.orderTypeSelectorRight,
              ...(orderType === "Stop-Limit"
                ? styles.activeOrderTypeButton
                : {}),
              fontSize: "12px",
            }}
            onClick={() => setOrderType("Stop-Limit")}
          >
            Stop-Limit
          </button>
        </div>

        <div>
          <div style={styles.inputContainer}>
            <div style={{ display: "flex", alignItems: "center" }}>
              Limit price <InfoIcon />
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                type="text"
                value={limitPrice}
                onChange={(e) => setLimitPrice(e.target.value)}
                style={styles.input}
              />
              <span style={{ marginLeft: "8px" }}>USD</span>
            </div>
          </div>

          <div style={styles.inputContainer}>
            <div style={{ display: "flex", alignItems: "center" }}>
              Amount <InfoIcon />
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={styles.input}
              />
              <span style={{ marginLeft: "8px" }}>USD</span>
            </div>
          </div>

          <div
            style={{
              ...styles.inputContainer,
              ...styles.orderTypeDropdown,
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              Type <InfoIcon />
            </div>
            <div style={styles.dropdown} onClick={toggleOrderTypeDropdown}>
              <span>{orderTypeDropdown}</span>
              <ChevronDownIcon />

              {showOrderTypeDropdown && (
                <div style={styles.dropdownMenu}>
                  {orderTypeOptions.map((type) => (
                    <div
                      key={type}
                      style={{
                        ...styles.dropdownItem,
                        ...(orderTypeDropdown === type
                          ? styles.dropdownItemHover
                          : {}),
                      }}
                      onClick={() => selectOrderType(type)}
                    >
                      {type}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div
            style={styles.checkboxContainer}
            onClick={() => setPostOnly(!postOnly)}
          >
            <div style={styles.checkbox}>{postOnly && <CheckmarkIcon />}</div>
            <span>Post Only</span>
            <InfoIcon />
          </div>

          <div style={styles.flexBetween}>
            <span>Total</span>
            <span>{calculateTotal()}</span>
          </div>

          <button
            style={{
              ...styles.buyButton,
              background: buyMode
                ? "linear-gradient(to right, #3B82F6, #8B5CF6)"
                : "linear-gradient(to right, #EF4444, #F97316)",
            }}
            onClick={() =>
              alert(
                `Order placed: ${
                  buyMode ? "Buy" : "Sell"
                } ${amount} BTC at ${limitPrice} USD`
              )
            }
          >
            {buyMode ? "Buy" : "Sell"} BTC
          </button>

          <div style={styles.flexBetween}>
            <div>
              <div style={styles.label}>Total account value</div>
              <div>0.00</div>
            </div>
            <div style={styles.dropdown}>
              <span>NGN</span>
              <ChevronDownIcon />
            </div>
          </div>

          <div style={styles.gridContainer}>
            <div>
              <div style={styles.label}>Open Orders</div>
              <div>0.00</div>
            </div>
            <div>
              <div style={styles.label}>Available</div>
              <div>0.00</div>
            </div>
          </div>

          <button
            style={styles.depositButton}
            onClick={() => alert("Deposit functionality would open here")}
          >
            Deposit
          </button>
        </div>
      </div>
    </div>
  );
}
