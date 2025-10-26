// src/pages/Home.jsx
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHabits } from '../hooks/useHabits';
import Navbar from '../components/Navbar';
import QuoteCard from '../components/QuoteCard';
import AddHabitForm from '../components/AddHabitForm';
import HabitCard from '../components/HabitCard';
import StreakCounter from '../components/StreakCounter';
import AISuggestions from '../components/AISuggestions';
import HabitCalendar from '../components/HabitCalendar';
import { getTodayString, getDailyQuote } from '../utils/helpers';

const Home = () => {
  const { fetchHabits } = useHabits();
  const habits = useSelector(state => state.habits.habits);
  const completions = useSelector(state => state.habits.completions);
  const today = getTodayString();
  const dailyQuote = getDailyQuote();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Daily Quote */}
        <div className="mb-8">
          <QuoteCard quote={dailyQuote.text} author={dailyQuote.author} />
        </div>

        {/* Streak Statistics */}
        <div className="mb-8">
          <StreakCounter />
        </div>

        {/* Add Habit Form */}
        <div className="mb-8">
          <AddHabitForm onHabitAdded={fetchHabits} />
        </div>

        {/* AI Suggestions */}
        <div className="mb-8">
          <AISuggestions />
        </div>

        {/* Habits List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Today's Habits
            </h2>
            <span className="text-sm text-gray-500">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>

          {habits.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="text-6xl mb-4">🌱</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Start Your Wellness Journey
              </h3>
              <p className="text-gray-600">
                Create your first habit to begin tracking your progress!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {habits.map(habit => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  isCompleted={
                    completions[habit.id] && completions[habit.id][today]
                  }
                  onUpdate={fetchHabits}
                />
              ))}
            </div>
          )}
        </div>

        {/* Tips Section */}
        {habits.length > 0 && (
          <div className="mt-8 bg-emerald-50 border-l-4 border-emerald-500 rounded-lg p-6">
            <h3 className="font-bold text-emerald-900 mb-2">💡 Pro Tips</h3>
            <ul className="text-sm text-emerald-800 space-y-1">
              <li>• Complete habits at the same time each day for better consistency</li>
              <li>• Start with 2-3 habits and gradually add more</li>
              <li>• Check the Track Progress page to see your trends and insights</li>
            </ul>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;