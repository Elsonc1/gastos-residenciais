/** @type {import('tailwindcss').Config} */
export default {
  // Especifica quais arquivos o Tailwind deve escanear para remover CSS não utilizado no build
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
