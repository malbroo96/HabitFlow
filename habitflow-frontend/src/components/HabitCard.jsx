// src/components/HabitCard.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toggleCompletion, deleteHabit, updateHabit } from '../store/slices/habitsSlice';
import { TrashIcon, FireIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { getTodayString } from '../utils/helpers';

const HabitCard = ({ habit, isCompleted, onUpdate }) => {
  const dispatch = useDispatch();
  const today = getTodayString();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async () => {
    if (isUpdating) return; // Prevent double-clicks
    setIsUpdating(true);

    try {
      const token = localStorage.getItem('token');
      
      // Toggle completion in backend
      const response = await fetch(`http://localhost:5000/api/habits/${habit.id}/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ date: today }),
      });

      if (!response.ok) throw new Error('Failed to toggle habit');
      
      const updatedHabit = await response.json();
      
      // Update Redux store with new completion status
      dispatch(toggleCompletion({ habitId: habit.id, date: today }));
      
      // Update streak in Redux
      dispatch(updateHabit({ 
        id: habit.id, 
        streak: updatedHabit.streak 
      }));

      // Trigger parent refresh if provided
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error toggling habit:', error);
      alert('Failed to update habit. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Delete "${habit.name}"? This cannot be undone.`)) {
      try {
        const token = localStorage.getItem('token');
        
        const response = await fetch(`http://localhost:5000/api/habits/${habit.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });

        if (!response.ok) throw new Error('Failed to delete habit');
        
        dispatch(deleteHabit(habit.id));
      } catch (error) {
        console.error('Error deleting habit:', error);
        alert('Failed to delete habit. Please try again.');
      }
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
            disabled={isUpdating}
            className={`p-2 rounded-full transition-colors duration-200 ${
              isCompleted
                ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                : 'bg-gray-100 text-gray-400 hover:bg-emerald-100 hover:text-emerald-600'
            } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
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