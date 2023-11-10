export const isNode = (): boolean => {
  // @ts-ignore
  return typeof IS_NODE !== 'undefined'
    ? // @ts-ignore
      IS_NODE
    : typeof process !== 'undefined' &&
        process.versions !== null &&
        process.versions.node !== null
}

export const isBrowser = (): boolean => {
  // @ts-ignore
  return typeof IS_BROWSER !== 'undefined'
    ? // @ts-ignore
      IS_BROWSER
    : typeof window !== 'undefined' &&
        typeof window.document !== 'undefined' &&
        !window.process?.versions?.node
}

export const isMobile = (mobileBreakpoint = 460): boolean => {
  if (isBrowser()) {
    const w = Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0
    )
    if (w < mobileBreakpoint) {
      return true
    }
  }
  return false
}

export function isFunction(o: any): boolean {
  return typeof o === 'function'
}

export function cloneObject(object: any): any {
  if (!object) return {}
  return { ...object }
}

export const params2queryString = (params: { [key: string]: string }): string =>
  Object.entries(params)
    .map(([k, v]: any) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&')

// Joins path segments.  Preserves initial "/" and resolves ".." and "."
// Does not support using ".." to go above/outside the root.
// This means that join("foo", "../../bar") will not resolve to "../bar"
export const join = (...segments: string[]): string => {
  // Split the inputs into a list of path commands.
  let parts: string[] = []
  for (let i = 0, l = segments.length; i < l; i++) {
    parts = parts.concat(segments[i].split('/'))
  }
  // Interpret the path commands to get the new resolved path.
  const newParts: string[] = []
  for (let i = 0, l = parts.length; i < l; i++) {
    const part = parts[i]
    // Remove leading and trailing slashes
    // Also remove "." segments
    if (!part || part === '.') continue
    // Interpret ".." to pop the last segment
    if (part === '..') newParts.pop()
    // Push new path segments.
    else newParts.push(part)
  }
  // Preserve the initial slash if there was one.
  // @ts-ignore
  if (parts[0] === '') newParts.unshift('')
  // Turn back into a single string path.
  return newParts.join('/') || (newParts.length ? '/' : '.')
}

// A simple function to get the dirname of a path
// Trailing slashes are ignored. Leading slash is preserved.
export const dirname = (path: string): string => join(path, '..')
