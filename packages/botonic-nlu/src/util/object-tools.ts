export const EMPTY_STRING_REGEX = /^\s+$/

export const isEmptyString = (value: string): boolean =>
  Boolean(EMPTY_STRING_REGEX.exec(value)) || Boolean(value === '')

export const isNumber = (value: string): boolean => {
  return !isNaN(parseInt(value))
}

export const flipObject = (obj: any): any => {
  return Object.keys(obj).reduce((newObj, key) => {
    newObj[obj[key]] = isNumber(key) ? parseInt(key) : key
    return newObj
  }, {} as any)
}

export function shuffle(a: any): any {
  let j, x, i
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1))
    x = a[i]
    a[i] = a[j]
    a[j] = x
  }
  return a
}
