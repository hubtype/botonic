export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array))
}

export function randomSort<T>(array: T[]): T[] {
  return array.sort(() => Math.random() - 0.5)
}
