/** @type {import('tailwindcss').Config} */

module.exports =  {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primary: "#059669",
        secondary: "rgb(248 250 252)",
        accent: '#e94f37'
      }
    },
  },
  plugins: [require("daisyui")],
  darkMode: false,
  daisyui:{
    themes:['light']
  }
}
