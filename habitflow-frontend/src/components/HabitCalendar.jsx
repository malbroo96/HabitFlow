// src/components/HabitCalendar.jsx
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const HabitCalendar = () => {
  const habits = useSelector(state => state.habits.habits);
  const completions = useSelector(state => state.habits.completions);
  
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get days in month
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);

  // Calculate completion percentage for a specific day
  const getCompletionForDay = (day) => {
    if (habits.length === 0) return 0;

    const dateStr = new Date(year, month, day).toISOString().split('T')[0];
    let completed = 0;

    habits.forEach(habit => {
      if (completions[habit.id] && completions[habit.id][dateStr]) {
        completed++;
      }
    });

    return Math.round((completed / habits.length) * 100);
  };

  // Get color based on completion percentage
  const getColorClass = (percentage) => {
    if (percentage === 0) return 'bg-gray-100 text-gray-400';
    if (percentage < 30) return 'bg-red-100 text-red-700';
    if (percentage < 60) return 'bg-yellow-100 text-yellow-700';
    if (percentage < 100) return 'bg-emerald-100 text-emerald-700';
    return 'bg-emerald-500 text-white font-bold';
  };

  // Check if date is today
  const isToday = (day) => {
    const today = new Date();
    return today.getDate() === day && 
           today.getMonth() === month && 
           today.getFullYear() === year;
  };

  // Check if date is in the future
  const isFuture = (day) => {
    const date = new Date(year, month, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
  };

  // Navigate months
  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Generate calendar days
  const calendarDays = [];
  
  // Empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="aspect-square"></div>);
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const completion = getCompletionForDay(day);
    const colorClass = getColorClass(completion);
    const today = isToday(day);
    const future = isFuture(day);

    calendarDays.push(
      <div
        key={day}
        className={`aspect-square flex flex-col items-center justify-center rounded-lg transition-all duration-200 hover:scale-105 ${
          future 
            ? 'bg-gray-50 text-gray-300 cursor-not-allowed' 
            : colorClass
        } ${today ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
      >
        <span className="text-sm font-semibold">{day}</span>
        {!future && completion > 0 && (
          <span className="text-xs mt-1">{completion}%</span>
        )}
      </div>
    );
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Habit Calendar
        </h2>
        <button
          onClick={goToToday}
          className="text-sm bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg hover:bg-emerald-200 transition-colors"
        >
          Today
        </button>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={previousMonth}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
        </button>
        
        <h3 className="text-xl font-semibold text-gray-900">
          {monthNames[month]} {year}
        </h3>
        
        <button
          onClick={nextMonth}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronRightIcon className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Completion Rate</h4>
        <div className="flex flex-wrap gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-100 rounded"></div>
            <span className="text-gray-600">No habits</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-100 rounded"></div>
            <span className="text-gray-600">0-29%</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-100 rounded"></div>
            <span className="text-gray-600">30-59%</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-emerald-100 rounded"></div>
            <span className="text-gray-600">60-99%</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-emerald-500 rounded"></div>
            <span className="text-gray-600">100%</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      {habits.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-emerald-600">
                {habits.reduce((sum, habit) => sum + habit.streak, 0)}
              </p>
              <p className="text-xs text-gray-600 mt-1">Total Streaks</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {Math.max(...habits.map(h => h.streak), 0)}
              </p>
              <p className="text-xs text-gray-600 mt-1">Longest Streak</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">
                {habits.length}
              </p>
              <p className="text-xs text-gray-600 mt-1">Active Habits</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitCalendar;