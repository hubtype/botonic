import { type BotContext, isDev, isWebchat } from '@botonic/core'
import {
  type ActionRequest,
  Multichannel,
  RequestContext,
  WebchatSettings,
  type WebchatSettingsProps,
} from '@botonic/react'
import React from 'react'

import { type FlowContent, FlowHandoff } from '../content-fields'
import { FlowBotAction } from '../content-fields/flow-bot-action'
import { filterContents } from '../filters'
import { splitAiAgentContents } from './ai-agent-from-user-input'
import { getFlowBuilderActionContext } from './context'
import { getContentsByFirstInteraction } from './first-interaction'
import { getContents } from './get-contents'

export type FlowBuilderActionProps = {
  contents: FlowContent[]
  webchatSettingsParams?: WebchatSettingsProps
}

export class FlowBuilderAction extends React.Component<FlowBuilderActionProps> {
  static contextType = RequestContext
  declare context: React.ContextType<typeof RequestContext>

  static async executeConversationStart(
    botContext: BotContext
  ): Promise<FlowBuilderActionProps> {
    const context = getFlowBuilderActionContext(botContext)
    const contents = await getContentsByFirstInteraction(context)

    const filteredContents = await FlowBuilderAction.processContents(
      botContext,
      contents
    )

    return { contents: filteredContents }
  }

  static async botonicInit(
    botContext: BotContext,
    contentID?: string
  ): Promise<FlowBuilderActionProps> {
    const contents = await getContents(botContext, contentID)

    const filteredContents = await FlowBuilderAction.processContents(
      botContext,
      contents
    )

    return { contents: filteredContents }
  }

  static async processContents(
    botContext: BotContext,
    contents: FlowContent[]
  ) {
    const filteredContents = await filterContents(botContext, contents)
    await FlowBuilderAction.trackAllContents(botContext, filteredContents)
    await FlowBuilderAction.resolveFlowAIAgentMessages(
      botContext,
      filteredContents
    )
    await FlowBuilderAction.doHandoffAndBotActions(botContext, filteredContents)

    return filteredContents
  }

  static async trackAllContents(
    botContext: BotContext,
    contents: FlowContent[]
  ) {
    for (const content of contents) {
      // TODO: This not track contents added by AIAGent with messages of type flowBuilderContent
      await content.trackFlow(botContext)
    }
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

  static async doHandoffAndBotActions(
    botContext: BotContext,
    contents: FlowContent[]
  ) {
    const handoffContent = contents.find(
      content => content instanceof FlowHandoff
    ) as FlowHandoff
    if (handoffContent) {
      await handoffContent.doHandoff(botContext)
    }

    const botActionContent = contents.find(
      content => content instanceof FlowBotAction
    ) as FlowBotAction
    if (botActionContent) {
      botActionContent.doBotAction(botContext)
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
