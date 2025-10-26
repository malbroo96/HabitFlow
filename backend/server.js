const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

// Basic route to check if server is running
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Connect to MongoDB but don't wait for it
connectDB().catch((err) => {
  console.warn("MongoDB connection error:", err.message);
  console.log("Server will continue running without MongoDB...");
});

// Middleware
app.use(cors()); // Allow all origins during development
app.use(express.json());

// Request logger middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Test routes
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend connected!" });
});

app.post("/api/test", (req, res) => {
  console.log("Received POST data:", req.body);
  res.json({ message: "POST request received!", data: req.body });
});

// Import and use user routes
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

// Import and use Gemini routes
const geminiRoutes = require("./routes/geminiRoutes");
app.use("/api/gemini", geminiRoutes);

// 404 handler - must be after all other routes
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.path,
    method: req.method,
  });
});

const PORT = process.env.PORT || 3000;

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error:", err);
  res
    .status(500)
    .json({ message: "Internal server error", error: err.message });
});

// Start server with error handling
const server = app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
  console.log(
    `API endpoint available at http://localhost:${PORT}/api/gemini/ask`
  );
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(
      `Port ${PORT} is already in use. Please try a different port or close the application using this port.`
    );
  } else {
    console.error("Server error:", error);
  }
});
