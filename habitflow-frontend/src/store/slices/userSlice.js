// src/store/slices/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profile: {
    name: '',
    email: '',
    joinedDate: new Date().toISOString(),
    totalStreak: 0,
    longestStreak: 0,
  },
  rewards: [],
  settings: {
    theme: 'light',
    notifications: true,
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Update user profile
    updateProfile: (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
    },

    // Add reward/badge
    addReward: (state, action) => {
      const reward = {
        id: Date.now().toString(),
        title: action.payload.title,
        description: action.payload.description,
        icon: action.payload.icon,
        earnedAt: new Date().toISOString(),
      };
      state.rewards.push(reward);
    },

    // Update user settings
    updateSettings: (state, action) => {
      state.settings = { ...state.settings, ...action.payload };
    },

    // Update streak stats
    updateStreakStats: (state, action) => {
      state.profile.totalStreak = action.payload.totalStreak;
      if (action.payload.totalStreak > state.profile.longestStreak) {
        state.profile.longestStreak = action.payload.totalStreak;
      }
    },

    // Load user data
    loadUserData: (state, action) => {
      state.profile = action.payload.profile || state.profile;
      state.rewards = action.payload.rewards || [];
      state.settings = action.payload.settings || state.settings;
    },
  },
});

export const {
  updateProfile,
  addReward,
  updateSettings,
  updateStreakStats,
  loadUserData,
} = userSlice.actions;

export default userSlice.reducer;