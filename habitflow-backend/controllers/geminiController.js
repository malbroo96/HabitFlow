// backend/controllers/geminiController.js
// Import required modules
const { GoogleGenAI } = require("@google/genai");
const multer = require("multer");
const fs = require("fs");
require("dotenv").config();

// Configure multer for handling file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
}).single("image");

// Create Gemini client using your API key from .env
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Helper function to convert file buffer to base64
function fileToGenerativePart(buffer, mimeType) {
  return {
    inlineData: {
      data: buffer.toString("base64"),
      mimeType,
    },
  };
}

const analyzeFood = async (req, res) => {
  upload(req, res, async (err) => {
    try {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      if (!req.file) {
        return res.status(400).json({ message: "Image file is required" });
      }
      // Early check for API key
      if (!process.env.GEMINI_API_KEY) {
        console.error("GEMINI_API_KEY is missing");
        return res.status(500).json({
          message: "Gemini API key is not configured on the server.",
        });
      }
      // Convert image to Gemini API format
      const imagePart = fileToGenerativePart(
        req.file.buffer,
        req.file.mimetype
      );
      // Prompt for analyzing food image
      const prompt =
        "Analyze this food image and provide the following information in JSON format: { 'name': 'food name', 'calories': 'estimated calories per serving', 'protein': 'protein content in grams', 'description': 'brief description of the food item', 'healthTips': 'health-related suggestions' }";

      // Get Gemini Vision model

      const result = await genAI.models.generateContent({
        // Use genAI.models.generateContent
        model: "gemini-2.5-flash",
        contents: [prompt, imagePart],
      });
      console.log("Full Gemini response:", result.text);
      const text = result.text.trim();
      // Try to parse the response as JSON
      const cleanedText = text
        .replace(/^```json\s*/i, "") // remove starting ```json or ```JSON
        .replace(/^```/, "") // just in case it starts with ```
        .replace(/```$/, "") // remove trailing ```
        .trim();

      try {
        const jsonResponse = JSON.parse(cleanedText);
        res.json(jsonResponse);
      } catch (parseErr) {
        console.error("JSON Parse Error:", parseErr);
        // If parsing fails, send the raw text
        res.json({ raw: text });
      }
    } catch (error) {
      console.error("Gemini API Error:", error);
      res.status(500).json({
        message: "Error analyzing food image",
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  });
};

const askGemini = async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    // Early check for API key
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is missing");
      return res.status(500).json({
        message: "Gemini API key is not configured on the server.",
      });
    }
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
      error: err.message || String(err),
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
};

module.exports = { askGemini, analyzeFood };
