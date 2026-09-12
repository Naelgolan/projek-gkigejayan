/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gki-cement': '#D4D5D1',
        'gki-stone': '#5D5E5B',
        'gki-wood': '#41301F',
        'gki-tan': '#958C79',
        'gki-cream': '#D9D2B1',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
