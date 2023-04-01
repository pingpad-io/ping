/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "src/pages/**/*.{ts,tsx}",
    "src/components/**/*.{ts,tsx}",
    "pages/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
  ],
  safelist: [
    ...[...Array(50).keys()].flatMap(i => [`max-w-[${i * 10}px]`])
  ],
  plugins: [require("daisyui")],
};
