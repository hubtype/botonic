export const isDev = process.env.NODE_ENV === 'development'
export const isProd = process.env.NODE_ENV === 'production'

export const staticAsset = path => {
  try {
    if (isURL(path)) return path // Webpack 5 >= fully resolves absolute path to assets
    const scriptBaseURL = document
      .querySelector('script[src*="webchat.botonic.js"]')
      .getAttribute('src')
    const scriptName = scriptBaseURL.split('/').pop()
    const basePath = scriptBaseURL.replace('/' + scriptName, '/')
    const resolvedStaticAssetPath = basePath + path
    return resolvedStaticAssetPath
  } catch (e) {
    console.error(`Could not resolve path: '${path}'`)
    return normalize(path)
  }
}

export const resolveImage = src => {
  if (isURL(src)) return src
  return staticAsset(src)
}

export const isURL = urlPath => {
  // @stephenhay (38 chars) from: https://mathiasbynens.be/demo/url-regex
  const pattern = new RegExp(/^(blob:)?(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/)
  return !!pattern.test(urlPath)
}

export function normalize(path) {
  const isAbsolute = path.charAt(0) === '/'
  const trailingSlash = path && path[path.length - 1] === '/'
  // Normalize the path
  path = normalizeArray(path.split('/'), !isAbsolute).join('/')
  if (!path && !isAbsolute) path = '.'
  if (path && trailingSlash) path += '/'
  return (isAbsolute ? '/' : '') + path
}

function normalizeArray(parts, allowAboveRoot) {
  const res = []
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i]
    if (!p || p === '.') continue
    if (p === '..') {
      if (res.length && res[res.length - 1] !== '..') {
        res.pop()
      } else if (allowAboveRoot) {
        res.push('..')
      }
    } else {
      res.push(p)
    }
  }
  return res
}
