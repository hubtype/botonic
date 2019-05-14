// https://github.com/testing-library/react-testing-library/issues/36#issuecomment-440442300 is cleaner,
// but I couldn't make it work
export interface ExtendedMatchers<R> extends jest.Matchers<R> {
  toBeAround(expected: number, maxError: number): R;
}
export function init() {
  expect.extend({
    // similar to https://github.com/jest-community/jest-extended/issues/145
    // could be implemented in terms on https://github.com/jest-community/jest-extended#tobewithinstart-end
    toBeAround(actual: number, expected: number, maxError: number) {
      const pass = Math.abs(actual - expected) < maxError;
      if (pass) {
        return {
          message: () =>
            `expected ${actual} to be around ${expected} with max error ${maxError}`,
          pass: true
        };
      } else {
        return {
          message: () =>
            `expected ${actual} not to be around ${expected} with max error ${maxError}`,
          pass: false
        };
      }
    }
  });
}
