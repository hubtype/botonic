// eslint-disable-next-line @typescript-eslint/ban-types
export function shallowClone<T extends object>(obj: T): T {
  if (obj == undefined) {
    return obj
  }
  //https://stackoverflow.com/a/28152032/145289 create copies the methods
  const clone = Object.create(obj)
  // without copying prototype, some fields (maybe the enums?) are not available in object
  // TODO try this let clone = Object.assign( Object.create( Object.getPrototypeOf(orig)), orig)
  // from https://stackoverflow.com/a/44782052/145289
  for (const prop in Object.getPrototypeOf(clone)) {
    clone[prop] = Object.getPrototypeOf(clone)[prop]
  }
  return clone as T
}

/**
 * Deep copy function for TypeScript.
 * @param T Generic type of target/copied value.
 * @param target Target value to be copied.
 * @see Source project, ts-deepcopy https://github.com/ykdr2017/ts-deepcopy
 * @see Code pen https://codepen.io/erikvullings/pen/ejyBYg
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export const deepClone = <T>(target: T, alreadyCloned: object[] = []): T => {
  if (alreadyCloned.includes(target as any)) {
    return target
  }
  alreadyCloned.push(target as any)
  if (target === undefined) {
    return target
  }
  if (target instanceof Date) {
    return new Date(target.getTime()) as any
  }
  if (target instanceof Array) {
    const cp = [] as any[]
    ;(target as any[]).forEach(v => {
      cp.push(v)
    })
    return cp.map((n: any) => deepClone<any>(n, alreadyCloned)) as any
  }
  if (typeof target === 'object' && Object.keys(target as any).length !== 0) {
    const cp = { ...(target as { [key: string]: any }) } as {
      [key: string]: any
    }
    Object.keys(cp).forEach(k => {
      cp[k] = deepClone<any>(cp[k], alreadyCloned)
    })
    return cp as T
  }
  return target
}

export interface Equatable {
  equals(other: Equatable): boolean
}

export interface Stringable {
  toString(): string
}

export interface ValueObject extends Equatable, Stringable {}

/**
 * It returns a ROUGH estimation, since V8 will greatly optimize anyway
 * @return the number of bytes
 * Not using https://www.npmjs.com/package/object-sizeof to minimize dependencies
 */
export function roughSizeOfObject(object: any): number {
  const objectList: any[] = []

  const recurse = function (value: any) {
    let bytes = 0
    if (typeof value === 'boolean') {
      bytes = 4
    } else if (typeof value === 'string') {
      bytes = value.length * 2
    } else if (typeof value === 'number') {
      bytes = 8
    } else if (value == null) {
      // Required because typeof null == 'object'
      bytes = 0
    } else if (typeof value === 'object' && objectList.indexOf(value) === -1) {
      objectList.push(value)
      for (const [k, v] of Object.entries(value)) {
        bytes += 8 // an assumed existence overhead
        bytes += recurse(k)
        bytes += recurse(v)
      }
    }

    return bytes
  }

  return recurse(object)
}
