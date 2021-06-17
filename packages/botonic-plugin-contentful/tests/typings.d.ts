// declare module '@types/jest'

declare namespace jest {
  interface Expect {
    <T = any>(actual: T, message?: string): JestMatchers<T>
  }
}
