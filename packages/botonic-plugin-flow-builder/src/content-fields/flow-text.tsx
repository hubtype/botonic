import { Text } from '@botonic/react'
import React from 'react'

import { FlowBuilderApi } from '../api'
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

  toBotonic(id: string): JSX.Element {
    return (
      <Text key={id}>
        {this.text}
        {this.buttons.map(button => button.renderButton(this.buttonStyle))}
      </Text>
    )
  }
}
