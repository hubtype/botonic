import { Text } from '@botonic/react'
import React from 'react'

import { ButtonStyle, TextNode } from '../flow-builder-models'
import { ContentFieldsBase } from './content-fields-base'
import { FlowButton } from './flow-button'

export class FlowText extends ContentFieldsBase {
  public text = ''
  public code = ''
  public buttons: FlowButton[] = []
  public buttonStyle = ButtonStyle.BUTTON

  static fromHubtypeCMS(component: TextNode, locale: string): FlowText {
    const newText = new FlowText(component.id)
    newText.code = component.code
    newText.buttonStyle = component.content.buttons_style || ButtonStyle.BUTTON
    newText.text = FlowText.getTextByLocale(locale, component.content.text)
    newText.buttons = component.content.buttons.map(button =>
      FlowButton.fromHubtypeCMS(button, locale)
    )
    return newText
  }

  toBotonic(id: string): JSX.Element {
    return (
      <Text key={id}>
        {this.text}
        {this.buttons.map(button =>
          button.renderButton(button.id, this.buttonStyle)
        )}
      </Text>
    )
  }
}
