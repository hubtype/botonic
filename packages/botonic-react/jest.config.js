// Options about JS are for compiling @botonic .js/jsx files
module.exports = {
  roots: ['tests/'],
  testRegex: '(/tests/.*|(\\.|/)(test|spec))\\.(js|jsx)$',
  testPathIgnorePatterns: ['lib', '.*.d.ts', 'tests/helpers', '.*.helper.js'],
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!/node_modules/'],
  transformIgnorePatterns: ['node_modules/(?!@botonic).+\\.(js|jsx)$'],
  moduleFileExtensions: ['js', 'jsx', 'json'],
  snapshotSerializers: [],
  modulePaths: ['node_modules', 'src'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/tests/__mocks__/fileMock.js',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  }
};
