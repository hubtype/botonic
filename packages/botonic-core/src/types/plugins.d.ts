/* eslint-disable node/no-missing-import */
import { Input, PluginConfig, Session } from '.'

export declare function loadPlugins(plugins: PluginConfig<any>[]): any
export declare function runPlugins(
  plugins: PluginConfig<any>[],
  mode: 'pre' | 'post',
  input: Input,
  session: Session,
  lastRoutePath: string,
  response?: any
): Promise<void>
