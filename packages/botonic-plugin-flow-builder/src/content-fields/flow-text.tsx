import { ActionRequest, Text } from '@botonic/react'
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
    newText.text = this.getTextByLocale(locale, cmsText.content.text)
    // this.replaceVariables(
    //   this.getTextByLocale(locale, cmsText.content.text),
    //   cmsApi.request
    // )
    newText.buttons = cmsText.content.buttons.map(button =>
      FlowButton.fromHubtypeCMS(button, locale, cmsApi)
    )
    return newText
  }

  static replaceVariables(text: string, request: ActionRequest): string {
    const matches = text.match(VARIABLE_REGEX)

    let replacedText = text
    if (matches && request) {
      matches.forEach(match => {
        const keyPath = match.slice(1, -1)
        const botVariable = keyPath.endsWith('_access_token')
          ? getValueFromKeyPath(request, match)
          : getValueFromKeyPath(request, keyPath)
        replacedText = replacedText.replace(match, botVariable ?? match)
      })
    }

    return replacedText
  }

  toBotonic(id: string, request: ActionRequest): JSX.Element {
    const replacedText = FlowText.replaceVariables(this.text, request)
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
