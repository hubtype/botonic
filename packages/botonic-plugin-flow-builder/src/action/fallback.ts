import { ActionRequest } from '@botonic/react'

import { FlowBuilderApi } from '../api'
import { FlowContent } from '../content-fields'
import { EventAction, trackEvent } from '../tracking'
import { FlowBuilderContext } from './index'

export async function getContentsByFallback({
  cmsApi,
  flowBuilderPlugin,
  request,
  resolvedLocale,
}: FlowBuilderContext): Promise<FlowContent[]> {
  const fallbackNode = await getFallbackNode(cmsApi, request)
  const fallbackContents = await flowBuilderPlugin.getContentsByNode(
    fallbackNode,
    resolvedLocale
  )

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

  await trackEvent(request, EventAction.Fallback, {
    userInput: request.input.data,
    fallbackOut: isFirstFallbackOption ? 1 : 2,
    fallbackMessageId: request.input.message_id,
  })

  return fallbackNode
}
