// src/pages/TrackProgress.jsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHabits } from '../hooks/useHabits';
import Navbar from '../components/Navbar';
import WeeklyBarChart from '../components/charts/WeeklyBarChart';
import MonthlyLineChart from '../components/charts/MonthlyLineChart';
import RadialProgressChart from '../components/charts/RadialProgressChart';
import RewardBadge from '../components/RewardBadge';
import {
  calculateWeeklyProgress,
  calculateMonthlyProgress,
  calculateOverallCompletion,
} from '../utils/helpers';

const TrackProgress = () => {
  useHabits(); // Load habits on mount
  const habits = useSelector(state => state.habits.habits);
  const completions = useSelector(state => state.habits.completions);

  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [overallCompletion, setOverallCompletion] = useState(0);

  useEffect(() => {
    // Calculate progress data whenever habits or completions change
    const weekly = calculateWeeklyProgress(habits, completions);
    const monthly = calculateMonthlyProgress(habits, completions);
    const overall = calculateOverallCompletion(habits, completions);

    setWeeklyData(weekly);
    setMonthlyData(monthly);
    setOverallCompletion(overall);
  }, [habits, completions]);

  // Calculate statistics
  const totalHabits = habits.length;
  const activeStreaks = habits.filter(h => h.streak > 0).length;
  const avgCompletion = weeklyData.length > 0
    ? Math.round(weeklyData.reduce((sum, day) => sum + day.percentage, 0) / weeklyData.length)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Progress</h1>
          <p className="text-gray-600">
            Visualize your habit completion trends and celebrate your achievements
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Habits</h3>
            <p className="text-3xl font-bold text-gray-900">{totalHabits}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Active Streaks</h3>
            <p className="text-3xl font-bold text-emerald-600">{activeStreaks}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Weekly Average</h3>
            <p className="text-3xl font-bold text-blue-600">{avgCompletion}%</p>
          </div>
        </div>

        {/* Charts Section */}
        {habits.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Data Yet
            </h3>
            <p className="text-gray-600">
              Create some habits and start tracking to see your progress charts!
            </p>
          </div>
        ) : (
          <>
            {/* Weekly and Monthly Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <WeeklyBarChart data={weeklyData} />
              <MonthlyLineChart data={monthlyData} />
            </div>

            {/* Radial Progress */}
            <div className="mb-8">
              <RadialProgressChart percentage={overallCompletion} />
            </div>

            {/* Rewards Section */}
            <RewardBadge />

            {/* Insights Section */}
            <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6">
              <h3 className="font-bold text-blue-900 mb-3">📈 Your Insights</h3>
              <div className="space-y-2 text-sm text-blue-800">
                {avgCompletion >= 80 && (
                  <p>🎉 Excellent work! You're completing over 80% of your habits this week.</p>
                )}
                {avgCompletion >= 50 && avgCompletion < 80 && (
                  <p>👍 Good progress! Keep pushing to reach 80% completion.</p>
                )}
                {avgCompletion < 50 && avgCompletion > 0 && (
                  <p>💪 Don't give up! Small steps lead to big changes. Keep going!</p>
                )}
                {activeStreaks === totalHabits && totalHabits > 0 && (
                  <p>🔥 Amazing! All your habits have active streaks!</p>
                )}
                {habits.some(h => h.streak >= 30) && (
                  <p>🏆 You've maintained a 30+ day streak! That's incredible dedication!</p>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default TrackProgress;