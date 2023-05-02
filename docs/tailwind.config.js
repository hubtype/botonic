/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: false, // disable Tailwind's reset
  },
  content: ['./src/**/*.{js,jsx,ts,tsx}', '../docs/**/*.mdx'], // my markdown stuff is in ../docs, not /src
  darkMode: ['class', '[data-theme="dark"]'], // hooks into docusaurus' dark mode settigns
  theme: {
    inset: {
      0: 0,
      auto: 'auto',
      10: '10px',
      20: '20px',
      30: '30px',
      40: '40px',
      50: '50px',
      60: '60px',
      70: '70px',
      80: '80px',
      90: '90px',
      100: '100px',
    },
    extend: {},
  },
  plugins: [],
  content: ['./src/**/*.html', './src/**/*.js', './src/**/*.jsx'],
  safelist: ['bg-purple-200', 'bg-purple-600', 'text-purple-100'],
  variants: {
    textColor: ['responsive', 'hover', 'focus', 'group-hover'],
  },
}
