import { type BotContext, isDev, isWebchat } from '@botonic/core'
import {
  Multichannel,
  RequestContext,
  WebchatSettings,
  type WebchatSettingsProps,
} from '@botonic/react'
import React from 'react'

import { FlowAiAgent, type FlowContent } from '../content-fields'
import { filterContents } from '../filters'
import { splitAiAgentContents } from '../utils/ai-agent'
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

    const filteredContents = await FlowBuilderAction.prepareContentsToRender(
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

    const contentsToRender = await FlowBuilderAction.prepareContentsToRender(
      botContext,
      contents
    )

    return { contents: contentsToRender }
  }

  static async prepareContentsToRender(
    botContext: BotContext,
    contents: FlowContent[]
  ) {
    const filteredContents = await filterContents(botContext, contents)

    for (const content of filteredContents) {
      if (content instanceof FlowAiAgent) {
        const splitContents = splitAiAgentContents(filteredContents)
        if (!splitContents) {
          continue
        }
        const { contentsBeforeAiAgent } = splitContents
        await content.processContent(botContext, contentsBeforeAiAgent)
      } else {
        await content.processContent(botContext)
      }
    }

    return filteredContents
  }

  render(): JSX.Element | JSX.Element[] {
    const { contents, webchatSettingsParams } = this.props
    const botContext = this.context as BotContext
    const shouldSendWebchatSettings =
      (isWebchat(botContext.session) || isDev(botContext.session)) &&
      !!webchatSettingsParams

    return (
      <>
        {shouldSendWebchatSettings && (
          <WebchatSettings {...webchatSettingsParams} />
        )}
        {contents.map(content => content.toBotonic(botContext))}
      </>
    )
  }
}

export class FlowBuilderMultichannelAction extends FlowBuilderAction {
  render(): JSX.Element | JSX.Element[] {
    const { contents, webchatSettingsParams } = this.props
    const botContext = this.context as BotContext
    const shouldSendWebchatSettings =
      (isWebchat(botContext.session) || isDev(botContext.session)) &&
      !!webchatSettingsParams

    return (
      <Multichannel text={{ buttonsAsText: false }}>
        {shouldSendWebchatSettings && (
          <WebchatSettings {...webchatSettingsParams} />
        )}
        {contents.map(content => content.toBotonic(botContext))}
      </Multichannel>
    )
  }
}
