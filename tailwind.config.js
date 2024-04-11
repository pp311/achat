/** @type {import('tailwindcss').Config} */
export default {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  content: [],
  theme: {
    extend: {},
    screens: {
      'xxs': '360px',
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      '3xl': '1920px'
    }
  },
  fontFamily: {
    sans: ['Roboto', "sans-serif"],
    rubik: ['Rubik', "sans-serif"],
    montserrat: ['Montserrat', "sans-serif"],
    quicksand: ['Quicksand', "sans-serif"],
    bitter: ['Bitter', "serif"],
    literata: ['Literata', "serif"],
    robotoslab: ['"Roboto Slab"', "serif"],
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "halloween"],
  },
}

