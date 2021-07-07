// Options about JS are for compiling @botonic .js/jsx files
module.exports = {
  roots: ['./'],
  testRegex: '(/tests/.*|(\\.|/)(test|spec))\\.(js|jsx|ts|tsx)$',
  testPathIgnorePatterns: [
    'lib',
    '.*.d.ts',
    'tests/helpers',
    '.*.helper.js',
    'tests/__mocks__',
  ],
  transform: {
    '\\.js$': 'babel-jest',
    '\\.(ts|tsx)$': 'ts-jest',
  },
  collectCoverageFrom: ['src/**/*.{js,ts,jsx,tsx}', '!/node_modules/'],
  transformIgnorePatterns: ['node_modules/(?!@botonic).+\\.(ts|tsx|js|jsx)$'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  coveragePathIgnorePatterns: ['.d.ts'],
  snapshotSerializers: [],
  modulePaths: ['node_modules', 'src'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/tests/__mocks__/file-mock.js',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
}
