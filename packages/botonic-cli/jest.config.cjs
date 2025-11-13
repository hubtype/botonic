module.exports = {
  testEnvironment: 'node',
  testTimeout: 1000000,
  roots: ['<rootDir>'],
  testMatch: ['**/tests/**/*.+(ts|tsx|js)', '**/+(*.)+(spec|test).+(ts|tsx|js)'],
  transform: {
    '^.+\\.(ts|tsx)$': ['@swc/jest'],
  },
  testPathIgnorePatterns: ['lib', '.*.d.ts', 'tests/helpers', '.*.helper.js', 'tests/__mocks__', 'botonic-tmp*'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transformIgnorePatterns: ['node_modules/(?!(ora|picocolors)/)'],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
}
