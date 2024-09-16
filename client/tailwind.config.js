// File 2. client\tailwind.config.js
export default {
  darkMode: 'class', // Apply dark mode based on a class
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Ensure all paths to your components are included
  ],
  theme: {
    extend: {
      // Font Family
      fontFamily: {
        sans: ['Nunito', 'sans-serif', 'Inter'], // Extend with custom fonts
      },
      // Custom Colors for light, dark, and colored themes
      colors: {
        customPurple: '#800080', // Custom purple color
        customBlue: '#2c3e50', // Custom blue color
        lightBackground: '#f3f4f6', // Light background
        lightCard: '#f3f4f6', // Light card background
        lightText: '#ffffff', // Light text color
        darkBackground: '#212121', // Dark background
        darkCard: '#3c3c3c', // Dark card background
        darkText: '#e4e4e7', // Dark text color
        coloredBackground: '#1E1B4B', // Colored theme background
        coloredCard: '#34495e', // Colored card background
        coloredText: '#ffffff', // Colored text color
        // Predefined color shades
        indigo: {
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
          950: '#1E1B4B',
        },
        lime: {
          500: '#84CC16',
          600: '#65A30D',
          700: '#4D7C0F',
          800: '#3F6212',
          900: '#365314',
          950: '#1C2810',
        },
      },
      // Additional styles
      backgroundImage: {
        'custom-texture': "url('/path-to-your-image/texture.png')", // Custom background texture
      },
      spacing: {
        '1/4': '25%', // Custom spacing
      },
      maxWidth: {
        full: '100%',
      },
      borderRadius: {
        'extra-large': '3.5rem', // Custom border radius
      },
    },
  },
  plugins: [],
}
