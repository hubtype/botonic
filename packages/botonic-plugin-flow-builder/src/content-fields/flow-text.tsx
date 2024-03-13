import { Text } from '@botonic/react'
import React from 'react'

import { FlowBuilderApi } from '../api'
import { VARIABLE_REGEX } from '../constants'
import { getValueFromKeyPath } from '../utils'
import { ContentFieldsBase } from './content-fields-base'
import { FlowButton } from './flow-button'
import { HtButtonStyle, HtTextNode } from './hubtype-fields'

export class FlowText extends ContentFieldsBase {
  public text = ''
  public code = ''
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
    newText.text = this.replaceVariables(
      this.getTextByLocale(locale, cmsText.content.text),
      cmsApi.request.session.user.extra_data
    )
    newText.buttons = cmsText.content.buttons.map(button =>
      FlowButton.fromHubtypeCMS(button, locale, cmsApi)
    )
    return newText
  }

  static replaceVariables(
    text: string,
    extraData?: Record<string, any>
  ): string {
    const matches = text.match(VARIABLE_REGEX)

    let replacedText = text
    if (matches && extraData) {
      matches.forEach(match => {
        const keyPath = match.slice(1, -1)
        const botVariable = getValueFromKeyPath(extraData, keyPath)
        replacedText = replacedText.replace(match, botVariable ?? match)
      })
    }

    return replacedText
  }

  toBotonic(id: string): JSX.Element {
    return (
      <Text key={id}>
        {this.text}
        {this.buttons.map((button, buttonIndex) =>
          button.renderButton(buttonIndex, this.buttonStyle)
        )}
      </Text>
    )
  }
}
