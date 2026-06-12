/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kahootRed: '#e21b3c',
        kahootBlue: '#1368ce',
        kahootYellow: '#d89e00',
        kahootGreen: '#26890c',
        kahootPurple: '#46178f',
        kahootDark: '#1a1a1a'
      }
    },
  },
  plugins: [],
}