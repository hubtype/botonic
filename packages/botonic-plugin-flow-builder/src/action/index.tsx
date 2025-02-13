import { INPUT } from '@botonic/core'
import { ActionRequest, Multichannel, RequestContext } from '@botonic/react'
import React from 'react'

import { FlowBuilderApi } from '../api'
import { FlowContent, FlowHandoff } from '../content-fields'
import { FlowBotAction } from '../content-fields/flow-bot-action'
import { getFlowBuilderPlugin } from '../helpers'
import BotonicPluginFlowBuilder from '../index'
import { trackFlowContent } from '../tracking'
import { inputHasTextData } from '../utils'
import { getContentsByFallback } from './fallback'
import { getContentsByFirstInteraction } from './first-interaction'
import { getContentsByKnowledgeBase } from './knowledge-bases'
import { getContentsByPayload } from './payload'

export type FlowBuilderActionProps = {
  contents: FlowContent[]
}

export class FlowBuilderAction extends React.Component<FlowBuilderActionProps> {
  static contextType = RequestContext
  declare context: React.ContextType<typeof RequestContext>

  static async executeConversationStart(
    request: ActionRequest
  ): Promise<FlowBuilderActionProps> {
    const context = getContext(request)
    const contents = await getContentsByFirstInteraction(context)
    const contentID = contents[0]?.code
    return await FlowBuilderAction.botonicInit(request, contentID)
  }

  static async botonicInit(
    request: ActionRequest,
    contentID?: string
  ): Promise<FlowBuilderActionProps> {
    const contents = await getContents(request, contentID)
    await trackFlowContent(request, contents)

    const handoffContent = contents.find(
      content => content instanceof FlowHandoff
    ) as FlowHandoff
    if (handoffContent) {
      await handoffContent.doHandoff(request)
    }

    const botActionContent = contents.find(
      content => content instanceof FlowBotAction
    ) as FlowBotAction
    if (botActionContent) {
      botActionContent.doBotAction(request)
    }

    return { contents }
  }

  render(): JSX.Element | JSX.Element[] {
    const { contents } = this.props
    const request = this.context as ActionRequest
    return contents.map(content => content.toBotonic(content.id, request))
  }
}

export class FlowBuilderMultichannelAction extends FlowBuilderAction {
  render(): JSX.Element | JSX.Element[] {
    const { contents } = this.props
    const request = this.context as ActionRequest
    return (
      <Multichannel text={{ buttonsAsText: false }}>
        {contents.map(content => content.toBotonic(content.id, request))}
      </Multichannel>
    )
  }
}

async function getContents(
  request: ActionRequest,
  contentID?: string
): Promise<FlowContent[]> {
  const context = getContext(request, contentID)

  if (request.session.is_first_interaction) {
    return await getContentsByFirstInteraction(context)
  }
  // TODO: Add needed logic when we can define contents for multilocale queue position message
  if (request.input.type === INPUT.EVENT_INITIAL_QUEUE_POSITION) {
    return []
  }

  if (request.input.payload || contentID) {
    const contentsByPayload = await getContentsByPayload(context)
    if (contentsByPayload.length > 0) {
      return contentsByPayload
    }

    return await getContentsByFallback(context)
  }

  if (inputHasTextData(request.input)) {
    const knowledgeBaseContents = await getContentsByKnowledgeBase(context)
    if (knowledgeBaseContents.length > 0) {
      return knowledgeBaseContents
    }
  }

  return await getContentsByFallback(context)
}

export interface FlowBuilderContext {
  cmsApi: FlowBuilderApi
  flowBuilderPlugin: BotonicPluginFlowBuilder
  request: ActionRequest
  resolvedLocale: string
  contentID?: string
}

function getContext(
  request: ActionRequest,
  contentID?: string
): FlowBuilderContext {
  const flowBuilderPlugin = getFlowBuilderPlugin(request.plugins)
  const cmsApi = flowBuilderPlugin.cmsApi
  const locale = flowBuilderPlugin.getLocale(request.session)
  const resolvedLocale = flowBuilderPlugin.cmsApi.getResolvedLocale(locale)
  return {
    cmsApi,
    flowBuilderPlugin,
    request,
    resolvedLocale,
    contentID,
  }
}
