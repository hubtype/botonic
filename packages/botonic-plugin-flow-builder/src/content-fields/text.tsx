import { Text } from '@botonic/react'
import React from 'react'

import { ButtonStyle, HtTextNode } from '../hubtype-models'
import { FlowButton } from './button'
import { ContentFieldsBase } from './content-base'

export class FlowText extends ContentFieldsBase {
  public text = ''
  public code = ''
  public buttons: FlowButton[] = []
  public buttonStyle = ButtonStyle.BUTTON

  static fromHubtypeCMS(component: HtTextNode, locale: string): FlowText {
    const newText = new FlowText(component.id)
    newText.code = component.code
    newText.buttonStyle = component.content.buttons_style || ButtonStyle.BUTTON
    newText.text = FlowText.getTextByLocale(locale, component.content.text)
    newText.buttons = component.content.buttons.map(button =>
      FlowButton.fromHubtypeCMS(button, locale)
    )
    return newText
  }

  toBotonic(index: number): JSX.Element {
    return (
      <Text key={index}>
        {this.text}
        {this.buttons.map((button, index) =>
          button.renderButton(index, this.buttonStyle)
        )}
      </Text>
    )
  }
}
