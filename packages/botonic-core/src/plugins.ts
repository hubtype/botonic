import { BotContext, Plugin } from './models'

interface RunPluginArgs {
  botContext: BotContext
  mode: PluginMode
  response?: string | null
}

type PluginMode = 'pre' | 'post'

export async function runPlugins({
  botContext,
  mode,
  response = null,
}: RunPluginArgs): Promise<void> {
  const plugins = botContext.plugins
  for (const key in plugins) {
    const plugin: Plugin = plugins[key]
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
