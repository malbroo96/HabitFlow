// src/components/Navbar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, ChartBarIcon, ArrowRightOnRectangleIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const isActive = (path) => location.pathname === path;

  const handleSignOut = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('habitflow_habits');
      localStorage.removeItem('habitflow_completions');
      window.location.href = '/login';
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">🌿</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">
              Habit<span className="text-emerald-500">Flow</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {/* Welcome Message */}
            {user.name && (
              <div className="hidden md:flex items-center space-x-2 text-gray-700 mr-4">
                <UserCircleIcon className="w-5 h-5 text-emerald-500" />
                <span className="text-sm">Welcome, <span className="font-semibold">{user.name}</span>!</span>
              </div>
            )}

            <Link
              to="/"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                isActive('/')
                  ? 'bg-emerald-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <HomeIcon className="w-5 h-5" />
              <span className="font-medium">Home</span>
            </Link>

            <Link
              to="/track-progress"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                isActive('/track-progress')
                  ? 'bg-emerald-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ChartBarIcon className="w-5 h-5" />
              <span className="font-medium">Track Progress</span>
            </Link>

            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-red-100 hover:text-red-600 transition-colors duration-200"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;