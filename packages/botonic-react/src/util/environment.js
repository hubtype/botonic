export function isDev() {
  return process.env.NODE_ENV == 'development'
}

export function isProd() {
  return process.env.NODE_ENV == 'production'
}

export const staticAsset = path => {
  try {
    const scriptBaseURL = document
      .querySelector('script[src$="webchat.botonic.js"]')
      .getAttribute('src')
    const scriptName = scriptBaseURL.split('/').pop()
    const basePath = scriptBaseURL.replace('/' + scriptName, '/')
    return basePath + path
  } catch (e) {
    return path
  }
}

export const resolveImage = src => {
  if (isURL(src)) return src
  return staticAsset(src)
}

export const isURL = urlPath => {
  // @stephenhay (38 chars) from: https://mathiasbynens.be/demo/url-regex
  const URL_PATTERN = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/
  const pattern = new RegExp(URL_PATTERN)
  return !!pattern.test(urlPath)
}
