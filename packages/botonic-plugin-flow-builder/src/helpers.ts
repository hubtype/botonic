import { Plugin } from '@botonic/core'
import BotonicPluginFlowBuilder from './index'
import { NodeComponent } from './flow-builder-models'

const FLOW_BUILDER_PLUGIN_NAME = 'BotonicPluginFlowBuilder'

export function getFlowBuilderPlugin(plugins: {
  [id: string]: Plugin
}): BotonicPluginFlowBuilder {
  const flowBuilderPlugin = Object.values(plugins).find(
    // @ts-ignore
    plugin => plugin.name.includes(FLOW_BUILDER_PLUGIN_NAME)
  ) as BotonicPluginFlowBuilder
  if (!flowBuilderPlugin)
    throw new Error(
      `You must include '@botonic/plugin-flow-builder' in your plugins file.`
    )
  return flowBuilderPlugin
}

export async function updateButtonUrls(
  hubtypeContent: any,
  contentKey: string,
  getContentFn: any
): Promise<void> {
  if (hubtypeContent.content[contentKey]) {
    for (const i in hubtypeContent.content[contentKey]) {
      const button = hubtypeContent.content[contentKey][i].button
      if (button?.url) {
        for (const j in button.url) {
          button.url[j] = {
            ...button.url[j],
            ...(await getContentFn(button.url[j].id)),
          }
        }
      }
    }
  }
}
