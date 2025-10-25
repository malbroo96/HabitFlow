// src/components/HabitCard.jsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { toggleCompletion, deleteHabit } from '../store/slices/habitsSlice';
import { TrashIcon, FireIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { getTodayString } from '../utils/helpers';

const HabitCard = ({ habit, isCompleted }) => {
  const dispatch = useDispatch();
  const today = getTodayString();

  const handleToggle = () => {
    dispatch(toggleCompletion({ habitId: habit.id, date: today }));
  };

  const handleDelete = () => {
    if (window.confirm(`Delete "${habit.name}"? This cannot be undone.`)) {
      dispatch(deleteHabit(habit.id));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <div className="text-3xl">{habit.icon}</div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{habit.name}</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>{habit.category}</span>
              {habit.scheduledTime && (
                <>
                  <span>•</span>
                  <span>{habit.scheduledTime}</span>
                </>
              )}
            </div>
          </div>

          {habit.streak > 0 && (
            <div className="flex items-center space-x-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
              <FireIcon className="w-4 h-4" />
              <span className="font-bold text-sm">{habit.streak}</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={handleToggle}
            className={`p-2 rounded-full transition-colors duration-200 ${
              isCompleted
                ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                : 'bg-gray-100 text-gray-400 hover:bg-emerald-100 hover:text-emerald-600'
            }`}
          >
            <CheckCircleIcon className="w-6 h-6" />
          </button>

          <button
            onClick={handleDelete}
            className="p-2 rounded-full bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-600 transition-colors duration-200"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {habit.scheduledDays && habit.scheduledDays.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <span
              key={day}
              className={`text-xs px-2 py-1 rounded ${
                habit.scheduledDays.includes(day)
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {day}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default HabitCard;