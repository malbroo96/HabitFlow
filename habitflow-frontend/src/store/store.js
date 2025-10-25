import { configureStore } from '@reduxjs/toolkit';
import habitsReducer from './slices/habitsSlice';
import userReducer from './slices/userSlice';
import progressReducer from './slices/progressSlice';

export const store = configureStore({
  reducer: {
    habits: habitsReducer,
    user: userReducer,
    progress: progressReducer,
  },
});

export default store;