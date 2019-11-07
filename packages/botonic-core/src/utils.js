export const isBrowser = () => {
  return typeof window !== 'undefined' && !window.process
}

export const isNode = () => {
  return !isBrowser() && typeof process !== 'undefined'
}

export const isMobile = (mobileBreakpoint = 460) => {
  if (isBrowser()) {
    let w = Math.max(
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
export const join = (/* path segments */) => {
  // Split the inputs into a list of path commands.
  var parts = []
  for (var i = 0, l = arguments.length; i < l; i++) {
    parts = parts.concat(arguments[i].split('/'))
  }
  // Interpret the path commands to get the new resolved path.
  var newParts = []
  for (i = 0, l = parts.length; i < l; i++) {
    var part = parts[i]
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
