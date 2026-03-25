import { type BotContext, INPUT, isDev, isWebchat } from '@botonic/core'
import {
  type ActionRequest,
  Multichannel,
  RequestContext,
  WebchatSettings,
  type WebchatSettingsProps,
} from '@botonic/react'
import React from 'react'

import { EMPTY_PAYLOAD } from '../constants'
import { type FlowContent, FlowHandoff } from '../content-fields'
import { FlowBotAction } from '../content-fields/flow-bot-action'
import { filterContents } from '../filters'
import { inputHasTextOrTranscript } from '../utils'
import {
  getContentsByAiAgentFromUserInput,
  splitAiAgentContents,
} from './ai-agent-from-user-input'
import { getFlowBuilderActionContext } from './context'
import { getContentsByFallback } from './fallback'
import { getContentsByFirstInteraction } from './first-interaction'
import { getContentsByKnowledgeBase } from './knowledge-bases'
import { getContentsByPayload } from './payload'

export type FlowBuilderActionProps = {
  contents: FlowContent[]
  webchatSettingsParams?: WebchatSettingsProps
}

export class FlowBuilderAction extends React.Component<FlowBuilderActionProps> {
  static contextType = RequestContext
  declare context: React.ContextType<typeof RequestContext>

  static async executeConversationStart(
    request: ActionRequest
  ): Promise<FlowBuilderActionProps> {
    const context = getFlowBuilderActionContext(request)
    const contents = await getContentsByFirstInteraction(context)
    const filteredContents = await filterContents(request, contents)
    await FlowBuilderAction.trackAllContents(request, filteredContents)
    await FlowBuilderAction.doHandoffAndBotActions(request, filteredContents)

    return { contents: filteredContents }
  }

  static async botonicInit(
    request: ActionRequest,
    contentID?: string
  ): Promise<FlowBuilderActionProps> {
    const contents = await getContents(request, contentID)
    const filteredContents = await filterContents(request, contents)
    await FlowBuilderAction.trackAllContents(request, filteredContents)
    await FlowBuilderAction.resolveFlowAIAgentMessages(
      request,
      filteredContents
    )
    await FlowBuilderAction.doHandoffAndBotActions(request, filteredContents)

    return { contents: filteredContents }
  }

  static async resolveFlowAIAgentMessages(
    botContext: BotContext,
    contents: FlowContent[]
  ) {
    const splitContents = splitAiAgentContents(contents)
    if (!splitContents) {
      return
    }
    const { aiAgentContent, contentsBeforeAiAgent } = splitContents

    if (aiAgentContent && aiAgentContent?.messages.length === 0) {
      await aiAgentContent.resolveAIAgentResponse(
        botContext,
        contentsBeforeAiAgent
      )
    }
  }

  static async trackAllContents(
    request: ActionRequest,
    contents: FlowContent[]
  ) {
    for (const content of contents) {
      await content.trackFlow(request)
    }
  }

  static async doHandoffAndBotActions(
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
    const shouldSendWebchatSettings =
      (isWebchat(request.session) || isDev(request.session)) &&
      !!webchatSettingsParams

    return (
      <>
        {shouldSendWebchatSettings && (
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
    const request = this.context as ActionRequest
    const shouldSendWebchatSettings =
      (isWebchat(request.session) || isDev(request.session)) &&
      !!webchatSettingsParams

    return (
      <Multichannel text={{ buttonsAsText: false }}>
        {shouldSendWebchatSettings && (
          <WebchatSettings {...webchatSettingsParams} />
        )}
        {contents.map(content => content.toBotonic(content.id, request))}
      </Multichannel>
    )
  }
}

async function getContents(
  request: ActionRequest,
  contentID?: string
): Promise<FlowContent[]> {
  const context = getFlowBuilderActionContext(request, contentID)

  if (request.session.is_first_interaction) {
    return await getContentsByFirstInteraction(context)
  }
  // TODO: Add needed logic when we can define contents for multi locale queue position message
  if (request.input.type === INPUT.EVENT_QUEUE_POSITION_CHANGED) {
    return []
  }

  if (request.input.payload?.startsWith(EMPTY_PAYLOAD)) {
    request.input.payload = undefined
  }

  if (request.input.payload || contentID) {
    const contentsByPayload = await getContentsByPayload(context)
    if (contentsByPayload.length > 0) {
      return contentsByPayload
    }

    return await getContentsByFallback(context)
  }

  if (inputHasTextOrTranscript(request.input)) {
    const aiAgentContents = await getContentsByAiAgentFromUserInput(context)
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
