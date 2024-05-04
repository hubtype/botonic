// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  roots: ['src/', 'tests/'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.tests.json',
      },
    ],
    '^.+\\.jsx?$': [
      'babel-jest',
      { configFile: path.resolve(__dirname, 'babel.config.js') },
    ],
  },
  preset: 'ts-jest',
  testRegex: '(/tests/.*|(\\.|/)(test|spec))\\.([jt]sx?)$',
  testPathIgnorePatterns: [
    'dist',
    'lib',
    '.*.d.ts',
    'tests/helpers',
    'tests/mocks',
    '.*json.*',
    '__mocks__',
  ],
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!/node_modules/'],
  transformIgnorePatterns: [
    'node_modules/(?!@botonic|axios|escape-string-regexp).+\\.(js|jsx)$',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  snapshotSerializers: [],
  setupFilesAfterEnv: [
    // 'jest-expect-message', // to display a message when an assert fails
    // 'jest-extended', // more assertions
    '<rootDir>/jest.setup.js',
  ],
  modulePaths: ['node_modules', 'src'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '@botonic/dx/baseline/tests/__mocks__/file-mock.js',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  testEnvironment: 'node',
}
