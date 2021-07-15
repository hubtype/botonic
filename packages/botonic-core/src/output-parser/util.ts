export function parseNumber(strNumber: string): number {
  return parseInt(strNumber)
}

export function parseBoolean(strNumber: string): boolean {
  if (strNumber === '0') return false
  return true
}
