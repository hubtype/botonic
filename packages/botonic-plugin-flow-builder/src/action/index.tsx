import { BotContext, INPUT, isDev, isWebchat } from '@botonic/core'
import {
  ActionRequest,
  Multichannel,
  RequestContext,
  WebchatSettings,
} from '@botonic/react'
import React from 'react'

import { FlowBuilderApi } from '../api'
import { FlowContent, FlowHandoff } from '../content-fields'
import { FlowBotAction } from '../content-fields/flow-bot-action'
import { ContentFilterExecutor } from '../filters'
import { getFlowBuilderPlugin } from '../helpers'
import BotonicPluginFlowBuilder from '../index'
import { trackFlowContent } from '../tracking'
import { inputHasTextData } from '../utils'
import { getContentsByAiAgent } from './ai-agent'
import { getContentsByFallback } from './fallback'
import { getContentsByFirstInteraction } from './first-interaction'
import { getContentsByKnowledgeBase } from './knowledge-bases'
import { getContentsByPayload } from './payload'

export type FlowBuilderActionProps = {
  contents: FlowContent[]
  webchatSettingsParams?: Record<string, any>
}

export class FlowBuilderAction extends React.Component<FlowBuilderActionProps> {
  static contextType = RequestContext
  declare context: React.ContextType<typeof RequestContext>

  static async executeConversationStart(
    request: ActionRequest
  ): Promise<FlowBuilderActionProps> {
    const context = getContext(request)
    const contents = await getContentsByFirstInteraction(context)
    const filteredContents = await filterContents(request, contents)
    await trackFlowContent(request, filteredContents)
    await FlowBuilderAction.doHandoffAndBotActions(request, filteredContents)

    return { contents: filteredContents }
  }

  static async botonicInit(
    request: ActionRequest,
    contentID?: string
  ): Promise<FlowBuilderActionProps> {
    const contents = await getContents(request, contentID)
    const filteredContents = await filterContents(request, contents)
    await trackFlowContent(request, filteredContents)
    await FlowBuilderAction.doHandoffAndBotActions(request, filteredContents)

    return { contents: filteredContents }
  }

  private static async doHandoffAndBotActions(
    request: ActionRequest,
    contents: FlowContent[]
  ) {
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
  }

  render(): JSX.Element | JSX.Element[] {
    const { contents, webchatSettingsParams } = this.props
    const request = this.context as ActionRequest
    return (
      <>
        {(isWebchat(request.session) || isDev(request.session)) &&
          !!webchatSettingsParams && (
            <WebchatSettings {...webchatSettingsParams} />
          )}
        {contents.map(content => content.toBotonic(content.id, request))}
      </>
    )
  }
}

export class FlowBuilderMultichannelAction extends FlowBuilderAction {
  render(): JSX.Element | JSX.Element[] {
    const { contents, webchatSettingsParams } = this.props

    return (
      <Multichannel text={{ buttonsAsText: false }}>
        <FlowBuilderAction
          contents={contents}
          webchatSettingsParams={webchatSettingsParams}
        />
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
  // TODO: Add needed logic when we can define contents for multi locale queue position message
  if (request.input.type === INPUT.EVENT_QUEUE_POSITION_CHANGED) {
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
    const aiAgentContents = await getContentsByAiAgent(context)
    if (aiAgentContents.length > 0) {
      return aiAgentContents
    }
    const knowledgeBaseContents = await getContentsByKnowledgeBase(context)
    if (knowledgeBaseContents.length > 0) {
      return knowledgeBaseContents
    }
  }

  return await getContentsByFallback(context)
}

async function filterContents(
  request: BotContext,
  contents: FlowContent[]
): Promise<FlowContent[]> {
  const flowBuilderPlugin = getFlowBuilderPlugin(request.plugins)
  const contentFilters = flowBuilderPlugin.contentFilters
  const contentFilterExecutor = new ContentFilterExecutor({
    filters: contentFilters,
  })

  const filteredContents: FlowContent[] = []
  for (const content of contents) {
    const filteredContent = await contentFilterExecutor.filter(request, content)
    filteredContents.push(filteredContent)
  }

  return filteredContents
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
  const resolvedLocale = flowBuilderPlugin.cmsApi.getResolvedLocale()
  return {
    cmsApi,
    flowBuilderPlugin,
    request,
    resolvedLocale,
    contentID,
  }
}
