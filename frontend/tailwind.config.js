/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
      sans: ['Poppins', 'sans-serif'], // Replace default sans-serif with Poppins
    },
    },
  },
  plugins: [],
};
