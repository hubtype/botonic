export function enumValues<T>(enumType: { [s: string]: T }): T[] {
  return Object.values(enumType).map(m => m as T)
}
