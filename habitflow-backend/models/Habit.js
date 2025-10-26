// backend/models/Habit.js
import mongoose from 'mongoose';

const habitSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Health & Fitness',
      'Mindfulness',
      'Learning',
      'Productivity',
      'Creativity',
      'Social',
      'Self-Care',
      'Other'
    ]
  },
  icon: {
    type: String,
    default: '✨'
  },
  scheduledDays: [{
    type: String,
    enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  }],
  scheduledTime: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: 'emerald'
  },
  streak: {
    type: Number,
    default: 0
  },
  completions: {
    type: Map,
    of: Boolean,
    default: {}
  }
}, {
  timestamps: true
});

// Index for faster queries
habitSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('Habit', habitSchema);