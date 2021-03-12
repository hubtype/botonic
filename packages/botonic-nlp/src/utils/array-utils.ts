export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array))
}
