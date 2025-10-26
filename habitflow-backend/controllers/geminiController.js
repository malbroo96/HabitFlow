// backend/controllers/geminiController.js
// Import the entire module object
const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

// Create Gemini client using your API key from .env
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const askGemini = async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    // Early check for API key to return a clear error when missing
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is missing");
      return res.status(500).json({
        message:
          "Gemini API key is not configured on the server. Please set GEMINI_API_KEY in the .env file.",
      });
    }

    console.log(
      "Using Gemini API key:",
      process.env.GEMINI_API_KEY ? "Key exists" : "Key missing"
    );

    console.log("Sending prompt to Gemini:", prompt);
    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    const text = result.text;
    console.log("Full Gemini response:", text);
    res.json({ reply: text });
  } catch (err) {
    console.error("Gemini API Error:", err);
    res.status(500).json({
      message: "Gemini API error",
      error: err && err.message ? err.message : String(err),
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
};
module.exports = { askGemini };
