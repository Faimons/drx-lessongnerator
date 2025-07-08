import React from 'react';
import { CheckCircle } from 'lucide-react';

export default function ProgressBar({ currentSlide, totalSlides, onSlideClick, completedSlides = [] }) {
  const progressPercentage = ((currentSlide + 1) / totalSlides) * 100;

  return (
    <div className="glass-effect p-4 border-b border-white/10">
      {/* Main Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-blue-300">
            Fortschritt
          </span>
          <span className="text-sm font-medium text-blue-300">
            {currentSlide + 1} von {totalSlides} Slides
          </span>
        </div>
        
        <div className="w-full bg-gray-700/50 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {Array.from({ length: totalSlides }, (_, index) => {
          const isCompleted = completedSlides.includes(index.toString());
          const isCurrent = index === currentSlide;
          const isClickable = index <= currentSlide || isCompleted;

          return (
            <button
              key={index}
              onClick={() => isClickable && onSlideClick(index)}
              disabled={!isClickable}
              className={`min-w-[40px] h-10 rounded-lg font-bold text-sm transition-all duration-200 flex items-center justify-center ${
                isCurrent
                  ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                  : isCompleted
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : isClickable
                  ? 'bg-gray-600 text-white hover:bg-gray-700'
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isCompleted ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                index + 1
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}