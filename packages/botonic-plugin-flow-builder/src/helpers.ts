import { ResolvedPlugins } from '@botonic/core'

import BotonicPluginFlowBuilder from './index'

const FLOW_BUILDER_PLUGIN_NAME = 'BotonicPluginFlowBuilder'

export function getFlowBuilderPlugin(
  plugins: ResolvedPlugins
): BotonicPluginFlowBuilder {
  const ERROR_MESSAGE = `You must include '@botonic/plugin-flow-builder' in your plugins file.`

  if (Object.values(plugins).length === 0) {
    throw new Error(ERROR_MESSAGE)
  }

  const flowBuilderPlugin = Object.values(plugins).find(
    plugin => plugin.constructor.name === FLOW_BUILDER_PLUGIN_NAME
  ) as unknown as BotonicPluginFlowBuilder

  if (!flowBuilderPlugin) {
    throw new Error(ERROR_MESSAGE)
  }

  return flowBuilderPlugin
}
