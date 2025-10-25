// src/components/QuoteCard.jsx
import React from 'react';
import { SparklesIcon } from '@heroicons/react/24/solid';

const QuoteCard = ({ quote, author }) => {
  return (
    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg shadow-lg p-8 text-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full"></div>
      <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-white opacity-10 rounded-full"></div>
      
      <div className="relative z-10">
        <div className="flex items-center space-x-2 mb-4">
          <SparklesIcon className="w-6 h-6" />
          <span className="text-sm font-semibold uppercase tracking-wide">Daily Inspiration</span>
        </div>
        
        <blockquote className="text-2xl md:text-3xl font-bold mb-4 leading-relaxed">
          "{quote}"
        </blockquote>
        
        <p className="text-emerald-100 text-lg">
          — {author}
        </p>
      </div>
    </div>
  );
};

export default QuoteCard;