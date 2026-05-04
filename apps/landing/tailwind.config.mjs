/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6FCF97",
        primaryDark: "#4CAF7A",
        background: "#F7FAF9",
        textMain: "#1F2937",
        textSoft: "#6B7280",
      },
    },
  },
  plugins: [],
};