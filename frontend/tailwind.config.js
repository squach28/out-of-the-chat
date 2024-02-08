/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "background": {
          "light": "#fffffe"
        },
        "button": {
          "light": "#6246ea"
        },
        "button-text": {
          "light": "#fffffe"
        },
        "headline": {
          "light": "#2b2c34"
        }
      }
    },
  },
  plugins: [],
}