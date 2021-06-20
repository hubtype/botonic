import { Input, PluginConfig, Session } from '.'

type PluginMode = 'pre' | 'post'

export declare function loadPlugins(plugins: PluginConfig<any>[]): any
export declare function runPlugins(
  plugins: PluginConfig<any>[],
  mode: PluginMode,
  input: Input,
  session: Session,
  lastRoutePath: string,
  response?: any
): Promise<void>
