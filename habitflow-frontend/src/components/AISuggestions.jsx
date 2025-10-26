// src/components/AISuggestions.jsx
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addHabit } from '../store/slices/habitsSlice';
import { SparklesIcon, XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';

const AISuggestions = () => {
  const dispatch = useDispatch();
  const habits = useSelector(state => state.habits.habits);
  const completions = useSelector(state => state.habits.completions);
  
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Calculate completion rate
  const calculateCompletionRate = () => {
    if (habits.length === 0) return 0;
    
    let totalCompleted = 0;
    let totalPossible = 0;
    
    habits.forEach(habit => {
      const habitCompletions = completions[habit.id] || {};
      totalCompleted += Object.values(habitCompletions).filter(Boolean).length;
      totalPossible += Object.keys(habitCompletions).length || 1;
    });
    
    return totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;
  };

const fetchSuggestions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const completionRate = calculateCompletionRate();
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/ai/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // ADD THIS LINE
        },
        body: JSON.stringify({
          habits: habits,
          completionRate: completionRate,
          userGoals: 'Improve overall wellness and build consistent habits'
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setSuggestions(data.suggestions);
        setIsOpen(true);
      } else {
        setError(data.error || 'Failed to get suggestions');
      }
    } catch (err) {
      setError('Cannot connect to AI server. Make sure backend is running!');
      console.error('Error fetching suggestions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSuggestion = (suggestion) => {
    dispatch(addHabit({
      name: suggestion.name,
      category: suggestion.category,
      icon: suggestion.icon,
      scheduledDays: [],
      scheduledTime: '',
    }));
    
    // Remove added suggestion from list
    setSuggestions(suggestions.filter(s => s.name !== suggestion.name));
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={fetchSuggestions}
        disabled={loading}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <SparklesIcon className="w-5 h-5" />
        <span className="font-semibold">
          {loading ? 'AI is thinking...' : '✨ Get AI Habit Suggestions'}
        </span>
      </button>

      {/* Error Message */}
      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
          <p className="mt-2 text-xs">Make sure to run: <code className="bg-red-100 px-2 py-1 rounded">cd backend && npm start</code></p>
        </div>
      )}

      {/* Suggestions Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <SparklesIcon className="w-8 h-8" />
                  <div>
                    <h2 className="text-2xl font-bold">AI-Powered Suggestions</h2>
                    <p className="text-purple-100 text-sm">Personalized habits just for you</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Suggestions List */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {suggestions.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No suggestions available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="border-2 border-gray-200 rounded-xl p-5 hover:border-purple-300 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          {/* Icon */}
                          <div className="text-4xl">{suggestion.icon}</div>
                          
                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-lg font-bold text-gray-900">
                                {suggestion.name}
                              </h3>
                              <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(suggestion.difficulty)}`}>
                                {suggestion.difficulty}
                              </span>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-3">
                              {suggestion.reason}
                            </p>
                            
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span className="bg-gray-100 px-3 py-1 rounded-full">
                                📂 {suggestion.category}
                              </span>
                              <span className="bg-gray-100 px-3 py-1 rounded-full">
                                ⏱️ {suggestion.timeCommitment}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Add Button */}
                        <button
                          onClick={() => handleAddSuggestion(suggestion)}
                          className="ml-4 bg-emerald-500 text-white p-3 rounded-lg hover:bg-emerald-600 transition-colors duration-200 flex items-center space-x-2"
                        >
                          <PlusIcon className="w-5 h-5" />
                          <span className="font-medium">Add</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <p className="text-xs text-gray-500 text-center">
                💡 Powered by Google Gemini AI • Suggestions are personalized based on your habits
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AISuggestions;