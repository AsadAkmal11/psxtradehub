const { GoogleGenerativeAI } = require("@google/generative-ai");
const TradeOrder = require("../models/tradeorder.model");
const dotenv = require("dotenv");
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const GEMINI_MODEL = "gemini-2.0-flash";

function buildGeminiPrompt(userMessage) {
  return `You are a trading assistant. Parse the following message and extract the trading intent as JSON.\n\nRules:\n- Only output valid JSON, no explanation.\n- If the message is unrelated to trading, output {\"intent\":\"unknown\"}.\n- If you are unsure, output {\"intent\":\"unknown\"}.\n- If price is missing, use \"market\".\n- Only valid actions: buy, sell.\n- JSON fields: action (buy/sell), symbol (string), quantity (integer), price (float or \"market\").\n\nMessage: \"${userMessage}\"`;
}

exports.tradeChat = async (req, res) => {
  const { message, customerNo, broker, portfolioId } = req.body;
  if (!message || !customerNo || !broker || !portfolioId) {
    return res.status(400).json({ reply: "❌ Missing required fields." });
  }

  try {
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
    const prompt = buildGeminiPrompt(message);
    const aiResponse = await model.generateContent(prompt);
    const text = aiResponse.response.text().trim();

    let parsed;
    try {
      // Extract JSON from markdown code blocks if present
      let jsonText = text;
      if (text.includes('```json')) {
        const match = text.match(/```json\s*([\s\S]*?)\s*```/);
        if (match) {
          jsonText = match[1].trim();
        }
      }
      parsed = JSON.parse(jsonText);
    } catch (err) {
      console.error("AI response not valid JSON:", text);
      return res.status(500).json({ reply: "❌ AI parsing error." });
    }

    if (parsed.intent === "unknown") {
      return res.json({ reply: "❓ Sorry, I couldn't understand your request." });
    }

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

    // Compose orderType and tradeDate
    const orderType = price === "market" ? "market" : "limit";
    const tradeDate = new Date();
    const priceValue = price === "market" ? 0 : price;

    await TradeOrder.create({
      customerNo,
      symbol,
      broker,
      portfolioId,
      tradeDate,
      action,
      orderType,
      quantity,
      price: priceValue,
      status: "pending",
    });

    return res.json({
      reply: `✅ Order placed: ${action} ${quantity} of ${symbol} at ${price}`,
    });
  } catch (err) {
    console.error("/trade-chat error:", err);
    return res.status(500).json({ reply: "❌ Internal server error." });
  }
}; 