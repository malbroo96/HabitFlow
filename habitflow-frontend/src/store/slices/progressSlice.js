// src/store/slices/progressSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  weeklyData: [],
  monthlyData: [],
  overallCompletion: 0,
};

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    // Calculate weekly progress
    setWeeklyData: (state, action) => {
      state.weeklyData = action.payload;
    },

    // Calculate monthly progress
    setMonthlyData: (state, action) => {
      state.monthlyData = action.payload;
    },

    // Set overall completion percentage
    setOverallCompletion: (state, action) => {
      state.overallCompletion = action.payload;
    },
  },
});

export const {
  setWeeklyData,
  setMonthlyData,
  setOverallCompletion,
} = progressSlice.actions;

export default progressSlice.reducer;