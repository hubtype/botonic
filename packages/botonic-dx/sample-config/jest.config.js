/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
const config = require('@botonic/dx/baseline/jest.config.js')
// You can here patch in config your custom configuration
// eg. avoid jest to complain on folders without tests
// config.testPathIgnorePatterns = config.testPathIgnorePatterns.concat(['tests/helpers'])
module.exports = config
