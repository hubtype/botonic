import { DataProvider } from './data-provider'
import {
  BotonicEvent,
  Input,
  PluginConfig,
  ResolvedPlugins,
  RoutePath,
  Session,
} from './models'

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
  plugins: ResolvedPlugins,
  mode: PluginMode,
  input: Input,
  session: Session,
  lastRoutePath: RoutePath,
  response: string | null = null,
  messageEvents: Partial<BotonicEvent>[] | null = null,
  dataProvider?: DataProvider
): Promise<void> {
  for (const key in plugins) {
    const p = await plugins[key]
    try {
      if (mode === 'pre' && p.pre) {
        await p.pre({ input, session, lastRoutePath, dataProvider, plugins })
      }
      if (mode === 'post' && p.post) {
        await p.post({
          input,
          session,
          lastRoutePath,
          response,
          messageEvents,
          dataProvider,
          plugins,
        })
      }
    } catch (e) {
      console.log(e)
    }
  }
}
