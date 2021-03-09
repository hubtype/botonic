module.exports = {
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
  },
  corePlugins: {
    preflight: false,
  },
  purge: {
    content: ['./src/**/*.html', './src/**/*.js', './src/**/*.jsx'],
    options: {
      whitelist: ['bg-purple-200', 'bg-purple-600', 'text-purple-100'],
    }
  },
  variants: {
    textColor: ['responsive', 'hover', 'focus', 'group-hover'],
  },
}
