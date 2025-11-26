/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    // Aquí está el cambio: Apuntamos directo a los archivos, sin atajos
    "node_modules/flowbite-react/dist/esm/**/*.js"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    // Usamos el plugin estándar
    require('flowbite/plugin')
  ],
}