export const isDev = process.env.NODE_ENV === 'development'
export const isProd = process.env.NODE_ENV === 'production'

export const staticAsset = path => {
  try {
    if (isURL(path)) return path // Webpack 5 >= fully resolves absolute path to assets
    const scriptBaseURL = document
      .querySelector('script[src$="webchat.botonic.js"]')
      .getAttribute('src')
    const scriptName = scriptBaseURL.split('/').pop()
    const basePath = scriptBaseURL.replace('/' + scriptName, '/')
    return basePath + path
  } catch (e) {
    console.error(`Could not resolve path: '${path}'`)
    return path
  }
}

export const resolveImage = src => {
  if (isURL(src)) return src
  return staticAsset(src)
}

export const isURL = urlPath => {
  // @stephenhay (38 chars) from: https://mathiasbynens.be/demo/url-regex
  const pattern = new RegExp(/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/)
  return !!pattern.test(urlPath)
}
