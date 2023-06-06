/** @type {import("prettier").Config} */
const config = {
  singleQuote: true,
  jsxSingleQuote: true,
  arrowParens: 'always',
  printWidth: 140,
  tabWidth: 2,
  useTabs: false,
  plugins: [require.resolve('prettier-plugin-tailwindcss')],
};

module.exports = config;
