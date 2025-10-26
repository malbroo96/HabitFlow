import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ✅ Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// ✅ Health Check Route
app.get("/api/health", (req, res) => {
  res.json({ message: "Backend is working! ✅" });
});

// ✅ Habit Suggestion Route
app.post("/api/suggestions", async (req, res) => {
  try {
    const { habit } = req.body;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: `Suggest improvements for this habit: ${habit}` }] }]
    });

    const aiResponse = result.response.text() ?? "No response from AI.";

    res.json({ suggestion: aiResponse });
  } catch (error) {
    console.error("❌ AI Suggestion Error:", error.message);
    res.status(500).json({ error: "Something went wrong! Check backend logs." });
  }
});

// ✅ Server Listener
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
});
