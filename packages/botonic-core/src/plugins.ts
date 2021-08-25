// @ts-nocheck
export function loadPlugins(plugins) {
  if (!plugins) return []
  const _plugins = {}
  const pluginsLength = plugins.length
  for (let i = 0; i < pluginsLength; i++) {
    const pluginRequired = plugins[i].resolve
    const options = plugins[i].options
    const Plugin = pluginRequired.default
    const instance = new Plugin(options)
    const id = plugins[i].id || `${instance.constructor.name}`
    _plugins[id] = instance
    _plugins[id].id = id
    _plugins[id].config = options
    _plugins[id].name = `${instance.constructor.name}`
  }
  return _plugins
}

export async function runPlugins(
  plugins,
  mode,
  input,
  session,
  lastRoutePath,
  response = null,
  parsedResponse = null
) {
  for (const key in plugins) {
    const p = await plugins[key]
    try {
      if (mode == 'pre') await p.pre({ input, session, lastRoutePath })
      if (mode == 'post')
        await p.post({
          input,
          session,
          lastRoutePath,
          response,
          parsedResponse,
        })
    } catch (e) {
      console.log(e)
    }
  }
}
