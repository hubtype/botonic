/**
 * given an object and a property, returns the property if exists (recursively), else undefined
 * ex:
 * let obj = { a: { b: { c: 5 } } }
 * getProperty(obj, 'a.b.c'), returns 5
 * getProperty(obj, 'a.b.z'), returns undefined
 */
export const getProperty = (obj, property) => {
  if (!property) return undefined
  const properties = property.split('.')
  for (let i = 0; i < properties.length; i++) {
    const prop = properties[i]
    // eslint-disable-next-line no-prototype-builtins
    if (!obj || !obj.hasOwnProperty(prop)) {
      return undefined
    } else {
      obj = obj[prop]
    }
  }
  return obj
}

export function strToBool(string) {
  const regex = /^\s*(true|1|on)\s*$/i
  string = String(string)
  return regex.test(string)
}

export const mapObject = (obj, conversion = ([key, value]) => [key, value]) => {
  return (
    obj &&
    Object.entries(obj)
      .map(conversion)
      .reduce(function (prev, curr) {
        prev[curr[0]] = curr[1]
        return prev
      }, {})
  )
}
