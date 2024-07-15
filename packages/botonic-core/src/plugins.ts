import { ActionRequest, PluginConfig, ResolvedPlugins } from './models'

type PluginMode = 'pre' | 'post'

export function loadPlugins(plugins: PluginConfig<any>[]): ResolvedPlugins {
  if (!plugins) return {}
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
  actionRequest: ActionRequest,
  mode: PluginMode,
  response: string | null = null
): Promise<void> {
  const { plugins } = actionRequest
  for (const key in plugins) {
    const plugin = plugins[key]
    try {
      if (mode === 'pre' && plugin.pre) {
        await plugin.pre(actionRequest)
      }
      if (mode === 'post' && plugin.post) {
        await plugin.post({
          ...actionRequest,
          response,
        })
      }
    } catch (e) {
      console.log(e)
    }
  }
}
