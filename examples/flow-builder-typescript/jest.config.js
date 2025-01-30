const config = require('@botonic/dx/baseline/jest.config.js')
// You can here patch in config your custom configuration
// eg. avoid jest to complain on folders without tests
// config.testPathIgnorePatterns = config.testPathIgnorePatterns.concat(['tests/helpers'])
config.transformIgnorePatterns = [
  'node_modules/(?!@botonic|react-children-utilities|escape-string-regexp|@hubtype|axios).+\\.(js|jsx)$',
]

config.moduleNameMapper = {
  ...config.moduleNameMapper,
  '^@botonic/core(.*)$': `${__dirname}/node_modules/@botonic/core$1`,
  '^@botonic/react(.*)$': `${__dirname}/node_modules/@botonic/react$1`,
}

config.testEnvironment = 'jsdom'

module.exports = config
