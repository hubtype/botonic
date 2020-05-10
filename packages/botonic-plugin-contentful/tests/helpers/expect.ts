import 'jest-expect-message'

export function expectEqualExceptOneField(
  actual: any,
  expected: any,
  exceptField: string
): void {
  for (const f of Object.keys(actual)) {
    if (f == exceptField) continue
    // eslint-disable-next-line jest/valid-expect
    expect(expected[f], `Fields '${f}' don't match`).toEqual(actual[f])
  }
}
