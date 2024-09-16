// JavaScript to toggle dark mode on/off
const toggleDarkMode = () => {
    const root = document.documentElement; // Get the <html> element
    if (root.classList.contains('dark')) {
      root.classList.remove('dark'); // Disable dark mode (light theme)
    } else {
      root.classList.add('dark'); // Enable dark mode
    }
  };
  
  // Add event listener to button to toggle dark mode
  document.getElementById('dark-mode-toggle').addEventListener('click', toggleDarkMode);
  