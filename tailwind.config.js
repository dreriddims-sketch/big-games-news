/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#f59e0b",
        "text-secondary": "#94a3b8",
        "bg-deep": "#0a0e14",
        "bg-darker": "#111827",
      },
      animation: {
        "spin-slow": "spin 8s linear infinite",
        "gradient-x": "gradient-x 15s ease infinite",
      },
      keyframes: {
        "gradient-x": {
          "0%, 100%": { "background-size": "200% 200%", "background-position": "left center" },
          "50%": { "background-size": "200% 200%", "background-position": "right center" },
        },
      },
    },
  },
  plugins: [],
}
