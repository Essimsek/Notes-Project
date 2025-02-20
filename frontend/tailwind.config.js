/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['"Montserrat"', 'sans-serif'],
        indieFlower: ['"Indie Flower"', 'serif'],

      }
    },
  },
  safelist: [
    {
      pattern: /bg-(red|green|blue|purple|pink|yellow|gray)-400/,
    }
  ],
  plugins: [],
}

