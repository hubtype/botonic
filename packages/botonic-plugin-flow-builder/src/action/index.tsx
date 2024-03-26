import { ActionRequest, Multichannel, RequestContext } from '@botonic/react'
import React from 'react'

import { FlowBuilderApi } from '../api'
import { FlowContent, FlowHandoff } from '../content-fields'
import { HtNodeWithContent } from '../content-fields/hubtype-fields'
import { getFlowBuilderPlugin } from '../helpers'
import { createNodeFromKnowledgeBase } from './knowledge-bases'
import { EventName, trackEvent } from '../tracking'

export type FlowBuilderActionProps = {
  contents: FlowContent[]
}

export class FlowBuilderAction extends React.Component<FlowBuilderActionProps> {
  static contextType = RequestContext

  static async botonicInit(
    request: ActionRequest
  ): Promise<FlowBuilderActionProps> {
    const flowBuilderPlugin = getFlowBuilderPlugin(request.plugins)
    const locale = flowBuilderPlugin.getLocale(request.session)

    const targetNode = await getTargetNode(flowBuilderPlugin.cmsApi, request)

    const contents = await flowBuilderPlugin.getContentsByNode(
      targetNode,
      locale
    )

    const handoffContent = contents.find(
      content => content instanceof FlowHandoff
    ) as FlowHandoff
    if (handoffContent) await handoffContent.doHandoff(request)

    return { contents }
  }

  render(): JSX.Element | JSX.Element[] {
    const { contents } = this.props
    const request = this.context
    return contents.map(content => content.toBotonic(content.id, request))
  }
}

export class FlowBuilderMultichannelAction extends FlowBuilderAction {
  render(): JSX.Element | JSX.Element[] {
    const { contents } = this.props
    const request = this.context
    return (
      <Multichannel text={{ buttonsAsText: false }}>
        {contents.map(content => content.toBotonic(content.id, request))}
      </Multichannel>
    )
  }
}

async function getTargetNode(cmsApi: FlowBuilderApi, request: ActionRequest) {
  if (request.session.is_first_interaction) {
    const startNode = cmsApi.getStartNode()
    await trackEvent(request, EventName.botStart)
    return startNode
  }
  const contentId = request.input.payload

  const targetNode = contentId
    ? cmsApi.getNodeById<HtNodeWithContent>(contentId)
    : undefined

  if (targetNode) {
    const eventArgs = {
      faq_name: targetNode.code,
    }
    await trackEvent(request, EventName.botFaq, eventArgs)
    return targetNode
  }
  return await getFallbackNode(cmsApi, request)
}

async function getFallbackNode(cmsApi: FlowBuilderApi, request: ActionRequest) {
  if (request.session.user.extra_data?.isFirstFallbackOption === undefined) {
    request.session.user.extra_data = {
      ...request.session.user.extra_data,
      isFirstFallbackOption: true,
    }
  }

  const knowledgeBaseNode = await createNodeFromKnowledgeBase(cmsApi, request)
  if (knowledgeBaseNode) {
    return knowledgeBaseNode
  }

  const isFirstFallbackOption =
    !!request.session.user.extra_data.isFirstFallbackOption
  const fallbackNode = cmsApi.getFallbackNode(isFirstFallbackOption)
  request.session.user.extra_data.isFirstFallbackOption = !isFirstFallbackOption

  await trackEvent(request, EventName.fallback)
  return fallbackNode
}
