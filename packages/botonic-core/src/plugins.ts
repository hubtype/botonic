import { BotContext, Plugin, PluginConfig, ResolvedPlugins } from './models'

interface RunPluginArgs {
  botContext: BotContext
  mode: PluginMode
  response?: string | null
}

type PluginMode = 'pre' | 'post'

export function loadPlugins(plugins?: PluginConfig<any>[]): ResolvedPlugins {
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

export async function runPlugins({
  botContext,
  mode,
  response = null,
}: RunPluginArgs): Promise<void> {
  const plugins = botContext.plugins
  for (const key in plugins) {
    const plugin: Plugin = await plugins[key]
    try {
      if (mode === 'pre' && typeof plugin.pre === 'function') {
        await plugin.pre(botContext)
      }
      if (mode === 'post' && typeof plugin.post === 'function') {
        await plugin.post({
          ...botContext,
          response,
        })
      }
    } catch (e) {
      console.log(e)
    }
  }
}
