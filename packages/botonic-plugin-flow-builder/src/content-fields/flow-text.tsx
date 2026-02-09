import type { TextMessage, TextWithButtonsMessage } from '@botonic/core'
import { type ActionRequest, Text } from '@botonic/react'

import type { FlowBuilderApi } from '../api'
import { EMPTY_PAYLOAD, SOURCE_INFO_SEPARATOR } from '../constants'
import { trackOneContent } from '../tracking'
import { ContentFieldsBase } from './content-fields-base'
import { FlowButton } from './flow-button'
import { HtButtonStyle, type HtTextNode } from './hubtype-fields'

export class FlowText extends ContentFieldsBase {
  public text = ''
  public buttons: FlowButton[] = []
  public buttonStyle = HtButtonStyle.BUTTON

  static fromHubtypeCMS(
    cmsText: HtTextNode,
    locale: string,
    cmsApi: FlowBuilderApi
  ): FlowText {
    const newText = new FlowText(cmsText.id)
    newText.code = cmsText.code
    newText.buttonStyle = cmsText.content.buttons_style || HtButtonStyle.BUTTON
    newText.text = FlowText.getTextByLocale(locale, cmsText.content.text)
    newText.buttons = cmsText.content.buttons.map(button =>
      FlowButton.fromHubtypeCMS(button, locale, cmsApi)
    )
    newText.followUp = cmsText.follow_up

    return newText
  }

  async trackFlow(request: ActionRequest): Promise<void> {
    await trackOneContent(request, this)
    for (const button of this.buttons) {
      await button.trackFlow(request)
    }
  }

  static fromAIAgent(
    id: string,
    textMessage: TextMessage | TextWithButtonsMessage
  ): JSX.Element {
    if (textMessage.type === 'text') {
      return <Text key={id}>{textMessage.content.text}</Text>
    }

    return (
      <Text key={id}>
        {textMessage.content.text}
        {textMessage.content.buttons.map((button, buttonIndex) => {
          const buttonData = {
            id: `${id}-button-${buttonIndex}`,
            text: button.text,
            url: button.url,
            payload:
              button.payload ||
              `${EMPTY_PAYLOAD}${SOURCE_INFO_SEPARATOR}${buttonIndex}`,
          }
          return FlowButton.fromAIAgent(buttonData).renderButton(buttonIndex)
        })}
      </Text>
    )
  }

  toBotonic(id: string, request: ActionRequest): JSX.Element {
    const replacedText = this.replaceVariables(this.text, request)
    return (
      <Text key={id}>
        {replacedText}
        {this.buttons.map((button, buttonIndex) =>
          button.renderButton(buttonIndex, this.buttonStyle)
        )}
      </Text>
    )
  }
}
