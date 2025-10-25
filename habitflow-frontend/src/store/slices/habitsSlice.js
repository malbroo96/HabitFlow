// src/store/slices/habitsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  habits: [],
  completions: {}, // { habitId: { '2025-10-25': true } }
};

const habitsSlice = createSlice({
  name: 'habits',
  initialState,
  reducers: {
    // Create new habit
    addHabit: (state, action) => {
      const newHabit = {
        id: Date.now().toString(),
        name: action.payload.name,
        category: action.payload.category,
        icon: action.payload.icon,
        scheduledDays: action.payload.scheduledDays || [],
        scheduledTime: action.payload.scheduledTime || '',
        color: action.payload.color || 'emerald',
        createdAt: new Date().toISOString(),
        streak: 0,
      };
      state.habits.push(newHabit);
      state.completions[newHabit.id] = {};
    },

    // Update existing habit
    updateHabit: (state, action) => {
      const index = state.habits.findIndex(h => h.id === action.payload.id);
      if (index !== -1) {
        state.habits[index] = { ...state.habits[index], ...action.payload };
      }
    },

    // Delete habit
    deleteHabit: (state, action) => {
      state.habits = state.habits.filter(h => h.id !== action.payload);
      delete state.completions[action.payload];
    },

    // Toggle habit completion for a specific date
    toggleCompletion: (state, action) => {
      const { habitId, date } = action.payload;
      if (!state.completions[habitId]) {
        state.completions[habitId] = {};
      }
      
      const isCompleted = state.completions[habitId][date];
      state.completions[habitId][date] = !isCompleted;

      // Update streak
      const habit = state.habits.find(h => h.id === habitId);
      if (habit) {
        habit.streak = calculateStreak(state.completions[habitId]);
      }
    },

    // Bulk load habits (for persistence)
    loadHabits: (state, action) => {
      state.habits = action.payload.habits || [];
      state.completions = action.payload.completions || {};
    },
  },
});

// Helper function to calculate current streak
function calculateStreak(completions) {
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
}

export const {
  addHabit,
  updateHabit,
  deleteHabit,
  toggleCompletion,
  loadHabits,
} = habitsSlice.actions;

export default habitsSlice.reducer;