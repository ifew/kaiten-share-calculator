/** @type {import('tailwindcss').Config} */
module.exports = {
  // Scan every file that can contain Tailwind class names, including
  // classes rendered dynamically from JavaScript template literals.
  content: ['./index.html', './app.js'],
  theme: {
    extend: {},
  },
  plugins: [],
};
