/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/components/**/*.{js,jsx,ts,tsx}", "./src/screens/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {

        "primary": "#2A2C39",

        "secondary": "#83BF00",

        "accent": "#111827",

        "neutral": "#2C2C3B",

        "base-100": "#FFFFFF",

        "info": "#3ABFF8",

        "success": "#36D399",

        "warning": "#FBBD23",

        "error": "#F87272",

        "black": "#F87272",
      }
    },
    fontFamily: {
      dosis: ['Dosis']
    },
  },
  plugins: [],
}
