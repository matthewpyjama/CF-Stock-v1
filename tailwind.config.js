/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        zinc: {
          850: '#1f1f1f',
          900: '#18181b',
          950: '#09090b',
        }
      }
    },
  },
  plugins: [],
}