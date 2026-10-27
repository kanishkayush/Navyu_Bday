/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', "Palatino", "Georgia", "serif"],
        sans: ["Outfit", '"Avenir Next"', '"Segoe UI"', "sans-serif"],
      },
      colors: {
        ink: "#070614",
        gold: "#e8c98a",
        blush: "#f3c1d3",
        lilac: "#c4b5fd",
      },
    },
  },
  plugins: [],
};
