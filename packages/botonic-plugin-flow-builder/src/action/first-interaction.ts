import { INPUT } from '@botonic/core'

import { BOT_ACTION_PAYLOAD_PREFIX } from '../constants'
import { FlowContent } from '../content-fields'
import { getNodeByUserInput } from '../user-input'
import { FlowBuilderContext } from './index'
import { getContentsByPayload } from './payload'

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

    return [...firstInteractionContents, ...contentsByUserInput]
  }

  return firstInteractionContents
}

async function getContentsByUserInput({
  cmsApi,
  flowBuilderPlugin,
  request,
  resolvedLocale,
}: FlowBuilderContext): Promise<FlowContent[]> {
  const nodeByUserInput = await getNodeByUserInput(
    cmsApi,
    resolvedLocale,
    request,
    flowBuilderPlugin.smartIntentsConfig
  )

  request.input.payload = cmsApi.getPayload(nodeByUserInput?.target)
  if (request.input.payload?.startsWith(BOT_ACTION_PAYLOAD_PREFIX)) {
    request.input.payload = flowBuilderPlugin.replaceBotActionPayload(
      request.input.payload
    )
  }

  return await getContentsByPayload({
    cmsApi,
    flowBuilderPlugin,
    request,
    resolvedLocale,
  })
}
