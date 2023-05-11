// // Options about JS are for compiling @botonic .js/jsx files
/** @type {import('jest').Config} */
const config = {
  verbose: true,
  roots: ['src/', 'tests/'],
  moduleFileExtensions: ['js', 'jsx', 'json'],
  testRegex: '(/tests/.*|(\\.|/)(test|spec))\\.(js|jsx)$',
  testPathIgnorePatterns: [
    'lib',
    '.*.d.ts',
    'tests/helpers',
    '.*.helper.js',
    'tests/__mocks__',
  ],
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!/node_modules/'],
  testEnvironment: 'jsdom',
  transformIgnorePatterns: [
    '/node_modules/(?!@botonic)|react-children-utilities',
  ],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/tests/__mocks__/file-mock.js',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^uuid$': require.resolve('uuid'),
  },
  modulePaths: ['node_modules', 'src'],
}

module.exports = config
