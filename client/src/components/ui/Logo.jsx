import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo({ showText = true, className = '', iconOnly = false }) {
  return (
    <Link to="/" className={`inline-flex items-center space-x-2.5 ${className}`} aria-label="EstateSocial Home">
      {/* Modern Emerald Architectural Emblem */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 dark:from-emerald-500 dark:to-teal-600 text-white p-2 rounded-xl shadow-md shadow-emerald-600/20 flex items-center justify-center transition-transform duration-200 hover:scale-105">
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-current"
        >
          {/* Main Skyscraper */}
          <path 
            d="M3 21H21M6 21V9L13 4V21M13 21V11L18 14V21" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          {/* Modern Geometric Window Accents */}
          <path 
            d="M8.5 12H10.5M8.5 15H10.5M8.5 18H10.5M15.5 16.5H16.5M15.5 18.5H16.5" 
            stroke="currentColor" 
            strokeWidth="1.75" 
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Brand Text */}
      {showText && !iconOnly && (
        <span className="font-brand text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-zinc-50">
          Estate<span className="text-emerald-600 dark:text-emerald-400">Social</span>
        </span>
      )}
    </Link>
  );
}
