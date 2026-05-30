/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Be Vietnam Pro", "Inter", "Segoe UI", "Roboto", "Arial", "sans-serif"],
        serif: ["Noto Serif", "Merriweather", "Georgia", "Times New Roman", "serif"],
      },
      boxShadow: {
        stitch: "0 20px 45px rgba(31, 41, 55, 0.08)",
        soft: "0 10px 30px rgba(15, 23, 42, 0.06)",
      },
    },
  },
  plugins: [],
};
