import React from 'react';

interface HeaderProps {
  darkMode: boolean;
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ darkMode, toggleTheme }) => {
  return (
    <header className={`border-b pb-5 mb-8 flex justify-between items-start ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="flex-1 pr-4">
        <h1 className={`text-3xl font-extrabold tracking-tight ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
          Meridian Onboarding Portal 🚀
        </h1>
        <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Your companion for the first month at Meridian. Hybrid work model (3 days office / 2 days remote).
        </p>
      </div>
      <button
        onClick={toggleTheme}
        className={`p-3 rounded-xl transition-all text-xl shadow-sm cursor-pointer flex-shrink-0 font-medium border ${
          darkMode 
            ? 'bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700' 
            : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-100'
        }`}
      >
        {darkMode ? '☀️ Light' : '🌙 Dark'}
      </button>
    </header>
  );
};