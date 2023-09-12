/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    colors: ({ colors }) => ({
      ...colors,
      'theme-color': 'rgba(0, 0, 0, 0.08)',
      'theme-color-deep': 'rgba(0, 0, 0, 0.12)'
    }),
    extend: {
      boxShadow: {
        design: '0 6px 16px -8px rgba(0, 0, 0, 0.08), 0 9px 28px 0px rgba(0, 0, 0, 0.05), 0 12px 48px 16px rgba(0, 0, 0, 0.03)'
      }
    }
  },
  plugins: [],
}

