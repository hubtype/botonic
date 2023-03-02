import { Button, Reply } from '@botonic/react'
import React from 'react'

import { ButtonStyle, HtButton } from '../hubtype-models'
import { ContentFieldsBase } from './content-base'

export class FlowButton extends ContentFieldsBase {
  public text = ''
  public url?: string
  public payload?: string

  static fromHubtypeCMS(component: HtButton, locale: string): FlowButton {
    const newButton = new FlowButton(component.id)
    newButton.text = FlowButton.getTextByLocale(locale, component.text)
    newButton.payload = component.target?.id
    return newButton
  }

  renderButton(index: number, buttonStyle: ButtonStyle) {
    if (buttonStyle === ButtonStyle.QUICK_REPLY) {
      return (
        <Reply payload={this.payload} key={index}>
          {this.text}
        </Reply>
      )
    }
    return (
      // @ts-ignore
      <Button payload={this.payload} key={index}>
        {this.text}
      </Button>
    )
  }
}
