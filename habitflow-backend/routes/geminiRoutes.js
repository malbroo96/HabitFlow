const express = require("express");
const router = express.Router();
const { askGemini } = require("../controllers/geminiController");

// Simple test to check if router is loaded
router.get("/", (req, res) => {
  res.json({ message: "Gemini router is working" });
});

// POST route to send prompt to Gemini API
router.post("/ask", askGemini);

// Optional informational GET for browsers visiting /ask
router.get("/ask", (req, res) => {
  res.status(200).json({
    message: 'Use POST /api/gemini/ask with JSON body { "prompt": "your prompt" }'
  });
});

module.exports = router;
