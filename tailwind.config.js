/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf4f5',
          100: '#fbe8eb',
          200: '#f7d5d9',
          300: '#f0b5be',
          400: '#e58897',
          500: '#d75d71',
          600: '#bf3f56',
          700: '#a03045',
          800: '#852b3d',
          900: '#712837',
          950: '#40111b',
        }
      }
    },
  },
  plugins: [],
}
