import { useState, useEffect } from 'react';
import Header from './components/Header';
import Home from './pages/Home';

function App() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200">
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <main>
        <Home />
      </main>
      <footer className="mt-16 py-6 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Made by TahuIsi Team</p>
          <p className="mt-2">Capstone Project Laskar AI 2025</p>
        </div>
      </footer>
    </div>
  );
}

export default App;