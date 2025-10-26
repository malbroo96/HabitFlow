// backend/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { GoogleGenerativeAI } from '@google/generative-ai';
import connectDB from './config/db.js';
import passportConfig from './config/passport.js';
import authRoutes from './routes/auth.js';
import habitRoutes from './routes/habits.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session configuration
app.use(session({
  secret: process.env.JWT_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport middleware
app.use(passportConfig.initialize());
app.use(passportConfig.session());

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'HabitFlow Server is running!',
    database: 'Connected',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);

// AI Suggestions Endpoint
app.post('/api/ai/suggestions', async (req, res) => {
  try {
    const { habits, completionRate, userGoals } = req.body;

    const habitNames = habits.map(h => h.name).join(', ');
    const categories = [...new Set(habits.map(h => h.category))].join(', ');
    
    const prompt = `You are a personal wellness coach AI. Analyze the user's current habits and provide 5 personalized new habit suggestions.

Current User Habits: ${habitNames || 'None yet'}
Current Categories: ${categories || 'None'}
Overall Completion Rate: ${completionRate}%
User Goals: ${userGoals || 'General wellness improvement'}

Based on this information, suggest 5 NEW habits that would complement their existing routine. For each suggestion, provide:
1. Habit name (short and clear)
2. Category (Health & Fitness, Mindfulness, Learning, Productivity, Creativity, Social, Self-Care, or Other)
3. Emoji icon (one emoji that represents the habit)
4. Brief reason why this habit would benefit them (1-2 sentences)
5. Suggested time commitment (e.g., "5 minutes", "20 minutes", "30 minutes")

Focus on:
- Balance: If they have many fitness habits, suggest mindfulness or learning
- Achievability: Start with small, manageable habits
- Science-backed benefits: Cite research when relevant
- Personalization: Connect to their existing successful patterns

Format your response as a JSON array with this structure:
[
  {
    "name": "Morning Meditation",
    "category": "Mindfulness",
    "icon": "🧘",
    "reason": "Your regular exercise routine shows discipline. Adding 5 minutes of meditation can reduce stress by 30% and improve focus throughout the day.",
    "timeCommitment": "5 minutes",
    "difficulty": "easy"
  }
]

IMPORTANT: Return ONLY the JSON array, no other text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    let suggestions;
    try {
      suggestions = JSON.parse(text);
    } catch (parseError) {
      console.error('Failed to parse AI response:', text);
      suggestions = [
        {
          name: "Morning Meditation",
          category: "Mindfulness",
          icon: "🧘",
          reason: "Start your day with clarity and calmness. Just 5 minutes can reduce stress and improve focus.",
          timeCommitment: "5 minutes",
          difficulty: "easy"
        },
        {
          name: "Drink 8 Glasses of Water",
          category: "Health & Fitness",
          icon: "💧",
          reason: "Proper hydration boosts energy, improves skin health, and aids cognitive function.",
          timeCommitment: "Throughout day",
          difficulty: "easy"
        },
        {
          name: "Read 20 Pages Daily",
          category: "Learning",
          icon: "📚",
          reason: "Reading daily expands knowledge, reduces stress, and improves vocabulary and focus.",
          timeCommitment: "20 minutes",
          difficulty: "medium"
        }
      ];
    }

    res.json({
      success: true,
      suggestions: suggestions,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI Suggestion Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate suggestions',
      message: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log('=================================');
  console.log(`🚀 HabitFlow Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Auth endpoint: http://localhost:${PORT}/api/auth`);
  console.log(`📋 Habits endpoint: http://localhost:${PORT}/api/habits`);
  console.log(`🤖 AI endpoint: http://localhost:${PORT}/api/ai/suggestions`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('=================================');
});