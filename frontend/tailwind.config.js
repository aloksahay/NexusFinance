/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#84cc16",
        success: "#84cc16",
        warning: "#facc15",
        error: "#ef4444",
        neutral: "#6b7280",
      },
    },
  },
  plugins: [],
}

