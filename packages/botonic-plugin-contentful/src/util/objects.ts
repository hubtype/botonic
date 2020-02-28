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

/**
 * Deep copy function for TypeScript.
 * @param T Generic type of target/copied value.
 * @param target Target value to be copied.
 * @see Source project, ts-deepcopy https://github.com/ykdr2017/ts-deepcopy
 * @see Code pen https://codepen.io/erikvullings/pen/ejyBYg
 */
export const deepClone = <T>(target: T, alreadyCloned: object[] = []): T => {
  // @ts-ignore
  if (alreadyCloned.includes(target)) {
    return target
  }
  // @ts-ignore
  alreadyCloned.push(target)
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
  if (typeof target === 'object' && target !== {}) {
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
