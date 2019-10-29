export function expectEqualExceptOneField(
  o1: any,
  o2: any,
  fieldName: string
): void {
  for (const f of Object.keys(o1)) {
    if (f == fieldName) continue
    expect(o2[f]).toEqual(o1[f])
  }
}
