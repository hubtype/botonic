// Options about JS are for compiling @botonic .js/jsx files
module.exports = {
  roots: ['src/'],
  testRegex: '(/tests/.*|(\\.|/)(test|spec))\\.(js|jsx)$',
  testPathIgnorePatterns: [
    'lib',
    '.*.d.ts',
    'tests/helpers',
    '.*.helper.js',
    'tests/__mocks__',
  ],
  transform: {
    '\\.js?$': 'babel-jest',
    '\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: ['src/**/*.{js,ts}', '!/node_modules/'],
  transformIgnorePatterns: ['node_modules/(?!@botonic).+\\.(ts|js)$'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  coveragePathIgnorePatterns: ['.d.ts'],
  snapshotSerializers: [],
  modulePaths: ['node_modules', 'src'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/tests/__mocks__/file-mock.js',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
}
