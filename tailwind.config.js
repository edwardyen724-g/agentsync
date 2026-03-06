const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, './src/app/**/*.{js,jsx,ts,tsx}'),
    join(__dirname, './src/components/**/*.{js,jsx,ts,tsx}'),
    join(__dirname, './src/pages/**/*.{js,jsx,ts,tsx}'),
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5', // Indigo
        secondary: '#E5E7EB', // Gray
        accent: '#FBBF24', // Amber
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};