import React, { useEffect, useState } from 'react';
import { FaSun, FaMoon, FaPalette } from 'react-icons/fa';

const DarkModeToggle = () => {
  const [theme, setTheme] = useState('light'); // Tracks the selected theme

  // Check the initial theme preference from localStorage or default to 'light'
  useEffect(() => {
    const root = document.documentElement;
    const savedTheme = localStorage.getItem('theme') || 'light';

    // Ensure no duplicate theme classes exist
    root.classList.remove('light', 'dark', 'colored');
    root.classList.add(savedTheme);

    setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    let newTheme;

    // Cycle between 'light', 'dark', and 'colored'
    if (theme === 'light') {
      newTheme = 'dark';
    } else if (theme === 'dark') {
      newTheme = 'colored';
    } else {
      newTheme = 'light';
    }

    // Ensure no duplicate theme classes exist before adding the new one
    root.classList.remove('light', 'dark', 'colored');
    root.classList.add(newTheme);

    // Save the new theme to localStorage
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
  };

  const getIcon = () => {
    if (theme === 'dark') return <FaSun />;
    if (theme === 'colored') return <FaPalette />;
    return <FaMoon />;
  };

  const getLabel = () => {
    if (theme === 'dark') return 'Light Mode';
    if (theme === 'colored') return 'Colored Mode';
    return 'Dark Mode';
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 bg-gray-800 text-white rounded-md flex items-center space-x-2"
    >
      {getIcon()}
      <span>{getLabel()}</span>
    </button>
  );
};

export default DarkModeToggle;
