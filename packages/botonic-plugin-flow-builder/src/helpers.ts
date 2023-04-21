import { Plugin } from '@botonic/core'
import BotonicPluginFlowBuilder from './index'

const FLOW_BUILDER_PLUGIN_NAME = 'BotonicPluginFlowBuilder'

export function getFlowBuilderPlugin(plugins: {
  [id: string]: Plugin
}): BotonicPluginFlowBuilder {
  const flowBuilderPlugin = Object.values(plugins).find(
    // @ts-ignore
    plugin => plugin.name === FLOW_BUILDER_PLUGIN_NAME
  ) as BotonicPluginFlowBuilder
  if (!flowBuilderPlugin)
    throw new Error(
      `You must include '@botonic/plugin-flow-builder' in your plugins file.`
    )
  return flowBuilderPlugin
}
