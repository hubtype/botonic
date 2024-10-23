// Options about JS are for compiling @botonic .js/jsx files
/** @type {import('jest').Config} */
module.exports = {
  roots: ['<rootDir>', 'src/', 'tests/'],
  preset: '../../node_modules/@babel/preset-typescript',
  testRegex: '(/tests/.*|(\\.|/)(test|spec))\\.(js|jsx)$',
  testPathIgnorePatterns: [
    'lib',
    '.*.d.ts',
    'tests/helpers',
    '.*.helper.js',
    'tests/__mocks__',
  ],
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!/node_modules/'],
  transformIgnorePatterns: [
    'node_modules/(?!@botonic|axios|react-children-utilities|parse5).+\\.(js|jsx|tsx)$',
  ],
  moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
  snapshotSerializers: [],
  moduleDirectories: ['<rootDir>', 'node_modules', 'src'],
  modulePaths: ['<rootDir>', 'node_modules', 'src'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/tests/__mocks__/file-mock.js',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
}
