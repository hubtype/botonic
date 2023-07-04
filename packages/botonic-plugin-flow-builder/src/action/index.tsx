import {
  EventBotFaq,
  EventFallback,
  EventName,
} from '@botonic/plugin-hubtype-analytics/lib/cjs/types'
import { ActionRequest, Multichannel, RequestContext } from '@botonic/react'
import React from 'react'
import { SOURCE_INFO_SEPARATOR } from 'src/constants'

import { FlowBuilderApi } from '../api'
import { FlowContent, FlowHandoff } from '../content-fields'
import { HtNodeWithContent } from '../content-fields/hubtype-fields'
import { getFlowBuilderPlugin } from '../helpers'
import { trackEvent } from './tracking'
import { getNodeByUserInput } from './user-input'

type FlowBuilderActionProps = {
  contents: FlowContent[]
}

export class FlowBuilderAction extends React.Component<FlowBuilderActionProps> {
  static contextType = RequestContext

  static async botonicInit(
    request: ActionRequest
  ): Promise<FlowBuilderActionProps> {
    const flowBuilderPlugin = getFlowBuilderPlugin(request.plugins)
    const locale = flowBuilderPlugin.getLocale(request.session)

    const targetNode = await getTargetNode(
      flowBuilderPlugin.cmsApi,
      locale,
      request
    )

    const contents = await flowBuilderPlugin.getContentsByNode(
      targetNode,
      locale
    )

    const handoffContent = contents.find(
      content => content instanceof FlowHandoff
    ) as FlowHandoff
    if (handoffContent) await handoffContent.doHandoff(request)

    const renderContents = contents.filter(content =>
      content instanceof FlowHandoff ? false : true
    )

    return { contents: renderContents }
  }

  render(): JSX.Element | JSX.Element[] {
    const { contents } = this.props
    return contents.map(content => content.toBotonic(content.id))
  }
}

export class FlowBuilderMultichannelAction extends FlowBuilderAction {
  render(): JSX.Element | JSX.Element[] {
    const { contents } = this.props
    return (
      <Multichannel text={{ buttonsAsText: false }}>
        {contents.map(content => content.toBotonic(content.id))}
      </Multichannel>
    )
  }
}

async function getTargetNode(
  cmsApi: FlowBuilderApi,
  locale: string,
  request: ActionRequest
) {
  const payload = request.input.payload
  const contentId = payload?.split(SOURCE_INFO_SEPARATOR)[0]
  const targetNode = !contentId
    ? await getNodeByUserInput(cmsApi, locale, request)
    : (cmsApi.getNodeById(contentId) as HtNodeWithContent)

  if (targetNode) {
    const event: EventBotFaq = {
      event_type: EventName.botFaq,
      event_data: {
        faq_name: targetNode.code,
      },
    }
    await trackEvent(request, event)
    return targetNode
  }
  return await getFallbackNode(cmsApi, request)
}

async function getFallbackNode(cmsApi: FlowBuilderApi, request: ActionRequest) {
  const isFirstFallbackOption =
    request.session.user.extra_data.isFirstFallbackOption ?? true
  const fallbackNode = cmsApi.getFallbackNode(isFirstFallbackOption)
  request.session.user.extra_data.isFirstFallbackOption = !isFirstFallbackOption

  const event: EventFallback = {
    event_type: EventName.fallback,
  }
  await trackEvent(request, event)
  return fallbackNode
}
