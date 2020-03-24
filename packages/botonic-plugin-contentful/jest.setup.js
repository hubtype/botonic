// When running all tests, the test which modify contentful contents may cause
// contention on the other tests (due to the sleep while retrying?)
// That's why we need such a large default timeout
// In the future we should run independently integration and unit tests
jest.setTimeout(15000)
// uncomment to extend jest test timeout while debugging from IDE
// jest.setTimeout(3000000)
