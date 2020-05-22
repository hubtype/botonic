export function isOfType<T extends string>(
  val: string,
  enumType: { [s: string]: T }
): val is T {
  return Object.values(enumType).find(m => m == val) != undefined
}
