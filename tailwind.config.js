import plugin from "tailwindcss/plugin";
import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",      // Next.js app dir
    "./components/**/*.{js,ts,jsx,tsx}", 
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./scripts/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@shadcn/ui/dist/**/*.mjs",
  ],
  
  plugins: [animate],
};

// Remove this duplicate config export
// const config = {
//   plugins: {
//     "@tailwindcss/postcss": {},
//   },
// };
// export default config;