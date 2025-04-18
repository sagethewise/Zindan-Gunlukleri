/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: '#15803d',
        'brand-dark': '#166534',
        'brand-light': '#22c55e',
      },
    },
  },
  plugins: [],
}
