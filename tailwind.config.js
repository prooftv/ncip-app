/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/features/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a365d',
        'primary-dark': '#0f2442',
        secondary: '#2c5282',
        accent: '#4299e1',
        light: '#f8f9fa',
        danger: '#e53e3e',
        success: '#38a169',
        gray: '#718096',
        'light-gray': '#e2e8f0',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #1a365d 0%, #2c5282 100%)',
        'gradient-danger': 'linear-gradient(135deg, #e53e3e 0%, #c53030 100%)',
      },
      fontFamily: {
        sans: ['"Segoe UI"', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
