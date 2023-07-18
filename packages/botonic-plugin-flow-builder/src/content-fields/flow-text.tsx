import { Text } from '@botonic/react'
import React from 'react'

import { FlowBuilderApi } from '../api'
import { VARIABLE_REGEX } from '../constants'
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
    newText.text = this.getTextByLocale(locale, cmsText.content.text)
    newText.buttons = cmsText.content.buttons.map(button =>
      FlowButton.fromHubtypeCMS(button, locale, cmsApi)
    )
    return newText
  }

  replaceVariables(extraData?: Record<string, any>): string {
    const matches = this.text.match(VARIABLE_REGEX)

    let replacedText = this.text
    if (matches && extraData) {
      matches.forEach(match => {
        const variable = match.slice(1, -1)
        const value = extraData[variable] ?? match
        replacedText = replacedText.replace(match, value)
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
