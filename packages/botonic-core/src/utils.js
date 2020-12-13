export const isNode = () => {
  return typeof IS_NODE !== 'undefined'
    ? // eslint-disable-next-line no-undef
      IS_NODE
    : typeof process !== 'undefined' &&
        process.versions !== null &&
        process.versions.node !== null
}
export const isBrowser = () => {
  return typeof IS_BROWSER !== 'undefined'
    ? // eslint-disable-next-line no-undef
      IS_BROWSER
    : typeof window !== 'undefined' && typeof window.document !== 'undefined'
}

export const isMobile = (mobileBreakpoint = 460) => {
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
export function isFunction(o) {
  return typeof o === 'function'
}

export const params2queryString = params =>
  Object.entries(params)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&')

// Joins path segments.  Preserves initial "/" and resolves ".." and "."
// Does not support using ".." to go above/outside the root.
// This means that join("foo", "../../bar") will not resolve to "../bar"
export const join = (...segments) => {
  // Split the inputs into a list of path commands.
  let parts = []
  for (let i = 0, l = segments.length; i < l; i++) {
    parts = parts.concat(segments[i].split('/'))
  }
  // Interpret the path commands to get the new resolved path.
  const newParts = []
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
  if (parts[0] === '') newParts.unshift('')
  // Turn back into a single string path.
  return newParts.join('/') || (newParts.length ? '/' : '.')
}

// A simple function to get the dirname of a path
// Trailing slashes are ignored. Leading slash is preserved.
export const dirname = path => join(path, '..')
