/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2EC4B6',
        secondary: '#CBF3F0',
        accent: '#FF9F1C',
        'accent-light': '#FFBF69',
      },
    },
  },
  plugins: [],
}

