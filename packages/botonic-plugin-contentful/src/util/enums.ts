export function enumValues<T>(enumType: { [s: string]: T }): T[] {
  return Object.values(enumType).map(m => m as T)
}

export function isOfType<T extends string>(
  val: string,
  enumType: { [s: string]: T }
): val is T {
  return Object.values(enumType).find(m => m == val) != undefined
}
