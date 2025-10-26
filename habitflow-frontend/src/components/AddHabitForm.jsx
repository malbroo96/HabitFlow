// src/components/AddHabitForm.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addHabit } from '../store/slices/habitsSlice';
import { PlusIcon } from '@heroicons/react/24/outline';
import { habitIcons, habitCategories } from '../utils/helpers';

const AddHabitForm = ({ onHabitAdded }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Health & Fitness',
    icon: '✨',
    scheduledDays: [],
    scheduledTime: '',
  });

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!formData.name.trim()) return;

  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch('http://localhost:5000/api/habits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) throw new Error('Failed to create habit');
    
    const habit = await response.json();
    
    dispatch(addHabit(habit));
    
    setFormData({
      name: '',
      category: 'Health & Fitness',
      icon: '✨',
      scheduledDays: [],
      scheduledTime: '',
    });
    setIsOpen(false);
    
    // Call callback to refresh habits list
    if (props.onHabitAdded) {
      props.onHabitAdded();
    }
  } catch (error) {
    console.error('Error creating habit:', error);
    alert('Failed to create habit. Please try again.');
  }
};

  const toggleDay = (day) => {
    setFormData(prev => ({
      ...prev,
      scheduledDays: prev.scheduledDays.includes(day)
        ? prev.scheduledDays.filter(d => d !== day)
        : [...prev.scheduledDays, day]
    }));
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-emerald-500 text-white py-3 rounded-lg hover:bg-emerald-600 transition-colors duration-200 flex items-center justify-center space-x-2 shadow-md"
      >
        <PlusIcon className="w-5 h-5" />
        <span className="font-semibold">Add New Habit</span>
      </button>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-emerald-500">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Create New Habit</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Habit Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Morning Exercise"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              {habitCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Icon
            </label>
            <select
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              {Object.entries(habitIcons).map(([key, icon]) => (
                <option key={key} value={icon}>{icon} {key}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Scheduled Time (Optional)
          </label>
          <input
            type="time"
            value={formData.scheduledTime}
            onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Scheduled Days (Optional)
          </label>
          <div className="flex flex-wrap gap-2">
            {weekDays.map(day => (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  formData.scheduledDays.includes(day)
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        <div className="flex space-x-3 pt-2">
          <button
            type="submit"
            className="flex-1 bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-600 transition-colors duration-200 font-semibold"
          >
            Create Habit
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-semibold"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddHabitForm;