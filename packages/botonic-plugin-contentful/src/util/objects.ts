export function shallowClone<T extends object>(obj: T): T {
  if (obj == undefined) {
    return obj
  }
  //https://stackoverflow.com/a/28152032/145289 create copies the methods
  const clone = Object.create(obj) as any
  // without copying prototype, some fields (maybe the enums?) are not available in object
  // TODO try this let clone = Object.assign( Object.create( Object.getPrototypeOf(orig)), orig)
  // from https://stackoverflow.com/a/44782052/145289
  for (const prop in Object.getPrototypeOf(clone)) {
    clone[prop] = Object.getPrototypeOf(clone)[prop]
  }
  return clone as T
}

// consider this deepClone in TS https://gist.github.com/erikvullings/ada7af09925082cbb89f40ed962d475e
