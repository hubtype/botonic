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

export function andArrays<T1 extends T2, T2>(a1: T1[], a2: T2[]): T1[] {
  const s2 = new Set(a2)
  return a1.filter(i => s2.has(i))
}
