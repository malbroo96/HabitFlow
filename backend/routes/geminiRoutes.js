const express = require("express");
const router = express.Router();
const { askGemini, analyzeFood } = require("../controllers/geminiController");

// Simple test to check if router is loaded
router.get("/", (req, res) => {
  res.json({ message: "Gemini router is working" });
});

// POST route to send prompt to Gemini API
router.post("/ask", askGemini);

// POST route to analyze food images
router.post("/analyze-food", analyzeFood);

// Optional informational GET endpoints
router.get("/ask", (req, res) => {
  res.status(200).json({
    message:
      'Use POST /api/gemini/ask with JSON body { "prompt": "your prompt" }',
  });
});

router.get("/analyze-food", (req, res) => {
  res.status(200).json({
    message:
      'Use POST /api/gemini/analyze-food with form-data containing "image" file',
  });
});

module.exports = router;
