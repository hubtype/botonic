module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 100000,
  roots: ['<rootDir>'],
  testMatch: [
    '**/tests/**/*.+(ts|tsx|js)',
    '**/+(*.)+(spec|test).+(ts|tsx|js)',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!/node_modules/'],
  modulePathIgnorePatterns: ['tests/dummy-project/*'],
  testPathIgnorePatterns: [
    'lib',
    '.*.d.ts',
    'tests/helpers',
    '.*.helper.js',
    'tests/__mocks__',
  ],
}
