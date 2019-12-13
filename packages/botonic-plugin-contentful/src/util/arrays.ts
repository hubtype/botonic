export function equalArrays<T>(a1: T[], a2: T[]): boolean {
  let i = a1.length
  if (i != a2.length) {
    return false
  }
  while (i--) {
    if (a1[i] !== a2[i]) return false
  }
  return true
}
