// src/utils/helpers.js

// Date formatting utilities
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const getTodayString = () => {
  return new Date().toISOString().split('T')[0];
};

export const getWeekDates = () => {
  const dates = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates;
};

export const getMonthDates = () => {
  const dates = [];
  const today = new Date();
  const daysInMonth = 30; // Simplified to last 30 days
  
  for (let i = daysInMonth - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates;
};

export const getDayName = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

// Progress calculation utilities
export const calculateWeeklyProgress = (habits, completions) => {
  const weekDates = getWeekDates();
  
  return weekDates.map(date => {
    let completed = 0;
    let total = habits.length;
    
    habits.forEach(habit => {
      if (completions[habit.id] && completions[habit.id][date]) {
        completed++;
      }
    });
    
    return {
      date,
      dayName: getDayName(date),
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  });
};

export const calculateMonthlyProgress = (habits, completions) => {
  const monthDates = getMonthDates();
  
  return monthDates.map(date => {
    let completed = 0;
    let total = habits.length;
    
    habits.forEach(habit => {
      if (completions[habit.id] && completions[habit.id][date]) {
        completed++;
      }
    });
    
    return {
      date,
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  });
};

export const calculateOverallCompletion = (habits, completions) => {
  if (habits.length === 0) return 0;
  
  const last30Days = getMonthDates();
  let totalPossible = habits.length * last30Days.length;
  let totalCompleted = 0;
  
  habits.forEach(habit => {
    last30Days.forEach(date => {
      if (completions[habit.id] && completions[habit.id][date]) {
        totalCompleted++;
      }
    });
  });
  
  return totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;
};

// Streak calculation
export const calculateCurrentStreak = (completions) => {
  const today = new Date();
  let streak = 0;
  let currentDate = new Date(today);
  
  while (true) {
    const dateStr = currentDate.toISOString().split('T')[0];
    if (completions[dateStr]) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
};

// Motivational quotes
export const motivationalQuotes = [
  {
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain"
  },
  {
    text: "Success is the sum of small efforts repeated day in and day out.",
    author: "Robert Collier"
  },
  {
    text: "You don't have to be great to start, but you have to start to be great.",
    author: "Zig Ziglar"
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt"
  },
  {
    text: "Your limitation—it's only your imagination.",
    author: "Unknown"
  },
  {
    text: "Great things never come from comfort zones.",
    author: "Unknown"
  },
  {
    text: "Dream it. Wish it. Do it.",
    author: "Unknown"
  },
  {
    text: "Success doesn't just find you. You have to go out and get it.",
    author: "Unknown"
  },
  {
    text: "The harder you work for something, the greater you'll feel when you achieve it.",
    author: "Unknown"
  },
  {
    text: "Don't stop when you're tired. Stop when you're done.",
    author: "Unknown"
  },
  {
    text: "Wake up with determination. Go to bed with satisfaction.",
    author: "Unknown"
  },
  {
    text: "Do something today that your future self will thank you for.",
    author: "Unknown"
  },
  {
    text: "Little things make big days.",
    author: "Unknown"
  },
  {
    text: "It's going to be hard, but hard does not mean impossible.",
    author: "Unknown"
  },
];

export const getDailyQuote = () => {
  const today = new Date().toDateString();
  const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = seed % motivationalQuotes.length;
  return motivationalQuotes[index];
};

// Habit icons mapping
export const habitIcons = {
  exercise: '💪',
  meditation: '🧘',
  reading: '📚',
  water: '💧',
  sleep: '😴',
  nutrition: '🥗',
  journal: '📝',
  study: '🎓',
  yoga: '🕉️',
  running: '🏃',
  gym: '🏋️',
  walk: '🚶',
  music: '🎵',
  art: '🎨',
  coding: '💻',
  clean: '🧹',
  default: '✨',
};

export const habitCategories = [
  'Health & Fitness',
  'Mindfulness',
  'Learning',
  'Productivity',
  'Creativity',
  'Social',
  'Self-Care',
  'Other',
];

// Reward badges based on streaks
export const getRewardForStreak = (streak) => {
  if (streak >= 365) return { title: '🏆 Year Warrior', description: '365 day streak!' };
  if (streak >= 180) return { title: '🌟 Half Year Hero', description: '180 day streak!' };
  if (streak >= 100) return { title: '💯 Century Club', description: '100 day streak!' };
  if (streak >= 60) return { title: '🔥 Two Month Master', description: '60 day streak!' };
  if (streak >= 30) return { title: '🎯 Monthly Champion', description: '30 day streak!' };
  if (streak >= 21) return { title: '⚡ Habit Former', description: '21 day streak!' };
  if (streak >= 14) return { title: '🌱 Two Week Wonder', description: '14 day streak!' };
  if (streak >= 7) return { title: '🎊 Week Warrior', description: '7 day streak!' };
  if (streak >= 3) return { title: '🚀 Getting Started', description: '3 day streak!' };
  return null;
};