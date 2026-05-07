import { type BotContext, isDev, isWebchat } from '@botonic/core'
import {
  Multichannel,
  RequestContext,
  WebchatSettings,
  type WebchatSettingsProps,
} from '@botonic/react'
import React from 'react'

import {
  FlowAiAgent,
  FlowAiAgentManager,
  FlowAiAgentRouter,
  type FlowContent,
} from '../content-fields'
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
    for (const content of contents) {
      if (
        content instanceof FlowAiAgent ||
        content instanceof FlowAiAgentRouter ||
        content instanceof FlowAiAgentManager
      ) {
        const splitContents = splitAiAgentContents(contents)
        if (!splitContents) {
          continue
        }

        if ('aiAgentRouterContent' in splitContents) {
          const { aiAgentRouterContent, contentsBeforeAiAgentRouter } =
            splitContents
          await aiAgentRouterContent.processContent(
            botContext,
            contentsBeforeAiAgentRouter
          )
        }

        if ('aiAgentManagerContent' in splitContents) {
          const { aiAgentManagerContent, contentsBeforeAiAgentManager } =
            splitContents
          await aiAgentManagerContent.processContent(
            botContext,
            contentsBeforeAiAgentManager
          )
        }

        if ('aiAgentContent' in splitContents) {
          const { aiAgentContent, contentsBeforeAiAgent } = splitContents
          await aiAgentContent.processContent(botContext, contentsBeforeAiAgent)
        }
      } else {
        await content.processContent(botContext)
      }
    }

    return contents
  }

  protected getWebchatSettingsParams(botContext: BotContext): {
    shouldSendWebchatSettings: boolean
    webchatSettingsParams?: WebchatSettingsProps
  } {
    let { webchatSettingsParams } = this.props
    if (botContext.session.user.system_locale_updated) {
      webchatSettingsParams = {
        ...webchatSettingsParams,
        user: {
          ...webchatSettingsParams?.user,
          system_locale: botContext.session.user.system_locale,
        },
      }
    }
    const shouldSendWebchatSettings =
      (isWebchat(botContext.session) || isDev(botContext.session)) &&
      !!webchatSettingsParams

    return {
      shouldSendWebchatSettings,
      webchatSettingsParams,
    }
  }

  render(): JSX.Element | JSX.Element[] {
    const { contents } = this.props
    const botContext = this.context as BotContext
    const { shouldSendWebchatSettings, webchatSettingsParams } =
      this.getWebchatSettingsParams(botContext)

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
    const { contents } = this.props
    const botContext = this.context as BotContext
    const { shouldSendWebchatSettings, webchatSettingsParams } =
      this.getWebchatSettingsParams(botContext)

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
