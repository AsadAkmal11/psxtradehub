import React, { useState } from "react";
import axios from "axios";
import { FaComments, FaTimes, FaPaperPlane } from "react-icons/fa";

const GeminiChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [customerNo, setCustomerNo] = useState("");
  const [broker, setBroker] = useState("");
  const [portfolioId, setPortfolioId] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResponse("");
    
    try {

      const res = await axios.post("/api/trade-chat", {
        message,
        customerNo,
        broker,
        portfolioId: portfolioId ? Number(portfolioId) : undefined,
        });
      setResponse(res.data.reply);
    } catch (err) {
      setError(
        err.response?.data?.reply || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setResponse("");
      setError("");
    }
  };

  return (
    <>
      {/* Floating Chat Icon */}
      <div
        onClick={toggleChat}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "#007bff",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          zIndex: 1000,
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = "scale(1.1)";
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "scale(1)";
        }}
      >
        {isOpen ? <FaTimes size={24} /> : <FaComments size={24} />}
      </div>

      {/* Chat Widget */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "100px",
            right: "20px",
            width: "350px",
            height: "500px",
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            border: "1px solid #e0e0e0",
            zIndex: 999,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: "#4a5568",
              color: "white",
              padding: "16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3 style={{color:"#F0B90B", margin: 0, fontSize: "16px" }}>Trade Chat (Gemini AI)</h3>
            <button
              onClick={toggleChat}
              style={{
                background: "none",
                border: "none",
                color: "#F0B90B",
                cursor: "pointer",
                fontSize: "18px",
              }}
            >
              <FaTimes />
            </button>
          </div>

          {/* Chat Content */}
          <div
            style={{
              flex: 1,
              padding: "16px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {/* Response Display */}
            {response && (
              <div
                style={{
                  backgroundColor: "#4a5568",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #4a5568",
                }}
              >
                <strong style={{
                    color: "#F0B90B",
                }}>AI Response:</strong> {response}
              </div>
            )}
            {error && (
              <div
                style={{
                  backgroundColor: "#f8d7da",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #f5c6cb",
                  color: "#721c24",
                }}
              >
                <strong>Error:</strong> {error}
              </div>
            )}
          </div>

          {/* Form */}
          <div style={{ padding: "16px", borderTop: "1px solid #F0B90B" }}>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <input
                type="text"
                placeholder="Customer No"
                value={customerNo}
                onChange={(e) => setCustomerNo(e.target.value)}
                required
                style={{
                  padding: "8px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}
              />
              <input
                type="text"
                placeholder="Broker"
                value={broker}
                onChange={(e) => setBroker(e.target.value)}
                required
                style={{
                  padding: "8px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}
              />
              <input
                type="number"
                placeholder="Portfolio ID"
                value={portfolioId}
                onChange={(e) => setPortfolioId(e.target.value)}
                required
                style={{
                  padding: "8px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}
              />
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="text"
                  placeholder="e.g. Buy 100 shares of 786 at 10.5"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  style={{
                    flex: 1,
                    padding: "8px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "14px",
                  }}
                />
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: "8px 12px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: loading ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {loading ? "..." : <FaPaperPlane size={14} />}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default GeminiChat;