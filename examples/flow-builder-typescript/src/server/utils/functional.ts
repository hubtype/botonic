export const empty = (object: Record<string, any>): boolean =>
  Object.keys(object).length === 0

export function toArray<T>(data: T | T[]): T[] {
  return Array.isArray(data) ? data : [data]
}

export function stringToBoolean(value: string): boolean {
  return value.toLowerCase() === 'true'
}
