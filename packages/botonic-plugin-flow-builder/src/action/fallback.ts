import { EventAction, EventFallback } from '@botonic/core'
import { ActionRequest } from '@botonic/react'

import { FlowBuilderApi } from '../api'
import { FlowContent } from '../content-fields'
import { trackEvent } from '../tracking'
import { FlowBuilderContext } from './index'

export async function getContentsByFallback({
  cmsApi,
  flowBuilderPlugin,
  request,
}: FlowBuilderContext): Promise<FlowContent[]> {
  const fallbackNode = await getFallbackNode(cmsApi, request)
  const fallbackContents =
    await flowBuilderPlugin.getContentsByNode(fallbackNode)

  return fallbackContents
}

async function getFallbackNode(cmsApi: FlowBuilderApi, request: ActionRequest) {
  if (request.session.user.extra_data?.isFirstFallbackOption === undefined) {
    request.session.user.extra_data = {
      ...request.session.user.extra_data,
      isFirstFallbackOption: true,
    }
  }

  const isFirstFallbackOption =
    !!request.session.user.extra_data.isFirstFallbackOption
  const fallbackNode = cmsApi.getFallbackNode(isFirstFallbackOption)
  request.session.user.extra_data.isFirstFallbackOption = !isFirstFallbackOption

  const event: EventFallback = {
    action: EventAction.Fallback,
    userInput: request.input.data as string,
    fallbackOut: isFirstFallbackOption ? 1 : 2,
    fallbackMessageId: request.input.message_id,
  }
  const { action, ...eventArgs } = event

  await trackEvent(request, action, eventArgs)

  return fallbackNode
}
