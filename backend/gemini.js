import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Sequelize, DataTypes } from "sequelize";

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
app.use(express.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const GEMINI_MODEL = "gemini-2.0-flash";

// Initialize Sequelize (adjust DB config as needed)
const sequelize = new Sequelize(
  process.env.DB_NAME || "psxtradehub",
  process.env.DB_USER || "root",
  process.env.DB_PASS || "",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    logging: false,
  }
);

// Define TradeOrder model (adjust fields as needed)
const TradeOrder = sequelize.define(
  "TradeOrder",
  {
    action: {
      type: DataTypes.ENUM("buy", "sell"),
      allowNull: false,
    },
    symbol: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.STRING, // can be float or 'market'
      allowNull: false,
    },
  },
  {
    tableName: "TradeOrder",
    timestamps: true,
  }
);

// Helper: Gemini prompt
function buildGeminiPrompt(userMessage) {
  return `You are a trading assistant. Parse the following message and extract the trading intent as JSON.\n\nRules:\n- Only output valid JSON, no explanation.\n- If the message is unrelated to trading, output {\"intent\":\"unknown\"}.\n- If you are unsure, output {\"intent\":\"unknown\"}.\n- If price is missing, use \"market\".\n- Only valid actions: buy, sell.\n- JSON fields: action (buy/sell), symbol (string), quantity (integer), price (float or \"market\").\n\nMessage: \"${userMessage}\"`;
}

// POST /trade-chat endpoint
app.post("/trade-chat", async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ reply: "❌ No message provided." });
  }

  try {
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
    const prompt = buildGeminiPrompt(message);
    const aiResponse = await model.generateContent(prompt);
    const text = aiResponse.response.text().trim();

    // Parse JSON safely
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (err) {
      console.error("AI response not valid JSON:", text);
      return res.status(500).json({ reply: "❌ AI parsing error." });
    }

    // Handle unknown intent
    if (parsed.intent === "unknown") {
      return res.json({ reply: "❓ Sorry, I couldn't understand your request." });
    }

    // Validate fields
    const { action, symbol, quantity, price } = parsed;
    if (
      !["buy", "sell"].includes(action) ||
      !symbol ||
      !Number.isInteger(quantity) ||
      quantity <= 0 ||
      (!((typeof price === "number" && price > 0) || price === "market"))
    ) {
      return res.status(400).json({ reply: "❌ Invalid order details." });
    }

    // Insert into DB
    await TradeOrder.create({
      action,
      symbol,
      quantity,
      price: price.toString(),
    });

    return res.json({
      reply: `✅ Order placed: ${action} ${quantity} of ${symbol} at ${price}`,
    });
  } catch (err) {
    console.error("/trade-chat error:", err);
    return res.status(500).json({ reply: "❌ Internal server error." });
  }
});

// Start server
const PORT = process.env.PORT || 3001;
(async () => {
  try {
    await sequelize.authenticate();
    await TradeOrder.sync();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
})();
