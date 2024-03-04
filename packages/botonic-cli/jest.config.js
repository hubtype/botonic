module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 1000000,
  roots: ['<rootDir>'],
  testMatch: [
    '**/tests/**/*.+(ts|tsx|js)',
    '**/+(*.)+(spec|test).+(ts|tsx|js)',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!/node_modules/'],
  testPathIgnorePatterns: [
    'lib',
    '.*.d.ts',
    'tests/helpers',
    '.*.helper.js',
    'tests/__mocks__',
    'botonic-tmp*',
  ],
}
