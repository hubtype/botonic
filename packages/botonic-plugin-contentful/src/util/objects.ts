export function shallowClone<T extends object>(obj: T): T {
  if (obj == undefined) {
    return obj
  }
  //https://stackoverflow.com/a/28152032/145289 create copies the methods
  const clone = Object.create(obj) as any
  // without copying prototype, some fields (maybe the enums?) are not available in object
  for (const prop in Object.getPrototypeOf(clone)) {
    clone[prop] = Object.getPrototypeOf(clone)[prop]
  }
  return clone as T
}
