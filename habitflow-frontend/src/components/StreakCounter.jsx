// src/components/StreakCounter.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { FireIcon, TrophyIcon, CalendarIcon } from '@heroicons/react/24/solid';

const StreakCounter = () => {
  const habits = useSelector(state => state.habits.habits);
  const completions = useSelector(state => state.habits.completions);

  const today = new Date().toISOString().split('T')[0];
  const completedToday = habits.filter(
    habit => completions[habit.id] && completions[habit.id][today]
  ).length;

  const longestStreak = habits.reduce((max, habit) => 
    habit.streak > max ? habit.streak : max, 0
  );

  const daysTracking = habits.length > 0 
    ? Math.floor((new Date() - new Date(habits[0].createdAt)) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium opacity-90">Today's Progress</h3>
          <CalendarIcon className="w-5 h-5 opacity-75" />
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-4xl font-bold">{completedToday}</span>
          <span className="text-xl opacity-75">/ {habits.length}</span>
        </div>
        <p className="text-sm mt-2 opacity-90">habits completed</p>
      </div>

      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium opacity-90">Longest Streak</h3>
          <FireIcon className="w-5 h-5 opacity-75" />
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-4xl font-bold">{longestStreak}</span>
          <span className="text-xl opacity-75">days</span>
        </div>
        <p className="text-sm mt-2 opacity-90">Keep the fire burning!</p>
      </div>

      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium opacity-90">Days Tracking</h3>
          <TrophyIcon className="w-5 h-5 opacity-75" />
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-4xl font-bold">{daysTracking}</span>
          <span className="text-xl opacity-75">days</span>
        </div>
        <p className="text-sm mt-2 opacity-90">Your wellness journey</p>
      </div>
    </div>
  );
};

export default StreakCounter;