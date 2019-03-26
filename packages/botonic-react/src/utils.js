export function isFunction(o) {
  return typeof o === 'function'
}

export function isDev() {
  return process.env.NODE_ENV == 'development'
}

export function isProd() {
  return process.env.NODE_ENV == 'production'
}

export async function runPlugins(
  plugins,
  mode,
  input,
  session,
  lastRoutePath,
  response = null
) {
  let pluginsLength = plugins.length
  for (let i = 0; i < pluginsLength; i++) {
    let pluginRequired = plugins[i].resolve
    let options = plugins[i].options
    try {
      let Plugin = pluginRequired.default
      let p = new Plugin(options)
      if (mode == 'pre') return p.pre({ input, session, lastRoutePath })
      if (mode == 'post')
        return p.post({ input, session, lastRoutePath, response })
    } catch (e) {
      console.log(e)
    }
  }
}
