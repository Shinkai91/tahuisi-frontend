import React from 'react';
import { ScanSearch, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ScanSearch className="w-7 h-7 text-emerald-600 dark:text-emerald-500" />
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Tahu<span className="text-emerald-600 dark:text-emerald-500">Isi</span>
          </h1>
        </div>
        
        <button 
          onClick={toggleDarkMode} 
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label={isDarkMode ? "Beralih ke mode terang" : "Beralih ke mode gelap"}
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
};

export default Header