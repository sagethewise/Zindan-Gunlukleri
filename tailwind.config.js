/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
   darkMode: "class", // kullanmıyoruz ama class basmadığımız için devre dışı gibi davranır
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
