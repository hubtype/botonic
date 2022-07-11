// https://github.com/testing-library/react-testing-library/issues/36#issuecomment-440442300 is cleaner,
// but I couldn't make it work
// causes "TypeError: Cannot read property 'name' of undefined" with versions > 22.12.0
export interface ExtendedMatchers<R, T> extends jest.Matchers<R, T> {
  toBeAround(expected: number, maxError: number): R
}
export function init() {
  expect.extend({
    // similar to https://github.com/jest-community/jest-extended/issues/145
    // could be implemented in terms on https://github.com/jest-community/jest-extended#tobewithinstart-end
    toBeAround(actual: number, expected: number, maxError: number) {
      const pass = Math.abs(actual - expected) < maxError
      if (pass) {
        return {
          message: () =>
            `expected ${actual} to be around ${expected} with max error ${maxError}`,
          pass: true,
        }
      } else {
        return {
          message: () =>
            `expected ${actual} not to be around ${expected} with max error ${maxError}`,
          pass: false,
        }
      }
    },
  })
}

// Wrapper for testing that errors are thrown
// See  https://github.com/jest-community/eslint-plugin-jest/blob/main/docs/rules/no-conditional-expect.md#how-to-catch-a-thrown-error-for-testing-without-violating-this-rule
class NoErrorThrownError extends Error {}

export const getError = async <TError>(
  call: () => unknown
): Promise<TError> => {
  try {
    await call()
    throw new NoErrorThrownError()
  } catch (error: unknown) {
    return error as TError
  }
}
