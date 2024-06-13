import { INPUT } from '@botonic/core'

import { BOT_ACTION_PAYLOAD_PREFIX } from '../constants'
import { FlowContent } from '../content-fields'
import { HtNodeWithContent } from '../content-fields/hubtype-fields'
import { getNodeByUserInput } from '../user-input'
import { FlowBuilderContext } from './index'

export async function getContentsByFirstInteraction({
  cmsApi,
  flowBuilderPlugin,
  request,
  resolvedLocale,
}: FlowBuilderContext): Promise<FlowContent[]> {
  const firstInteractionContents =
    await flowBuilderPlugin.getStartContents(resolvedLocale)

  if (request.input.data && request.input.type === INPUT.TEXT) {
    const contentsByUserInput = await getContentsByUserInput({
      cmsApi,
      flowBuilderPlugin,
      request,
      resolvedLocale,
    })

    if (contentsByUserInput) {
      return [...firstInteractionContents, ...contentsByUserInput]
    }
  }

  return firstInteractionContents
}

async function getContentsByUserInput({
  cmsApi,
  flowBuilderPlugin,
  request,
  resolvedLocale,
}: FlowBuilderContext): Promise<FlowContent[] | undefined> {
  const nodeByUserInput = await getNodeByUserInput(
    cmsApi,
    resolvedLocale,
    request,
    flowBuilderPlugin.smartIntentsConfig
  )

  let payload = cmsApi.getPayload(nodeByUserInput?.target)
  if (payload?.startsWith(BOT_ACTION_PAYLOAD_PREFIX)) {
    payload = flowBuilderPlugin.replaceBotActionPayload(payload)
  }

  const resolvedNode = payload
    ? cmsApi.getNodeById<HtNodeWithContent>(payload)
    : undefined

  return resolvedNode
    ? await flowBuilderPlugin.getContentsByNode(resolvedNode, resolvedLocale)
    : undefined
}
