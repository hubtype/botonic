import { Button, Reply } from '@botonic/react'
import React from 'react'

import { ContentFieldsBase } from './content-fields-base'
import { HtButton, HtButtonStyle } from './hubtype-fields'

export class FlowButton extends ContentFieldsBase {
  public text = ''
  public url?: string
  public payload?: string

  static fromHubtypeCMS(component: HtButton, locale: string): FlowButton {
    const newButton = new FlowButton(component.id)
    newButton.text = FlowButton.getTextByLocale(locale, component.text)
    newButton.payload = component.target
      ? component.target.id
      : component.payload?.find(payload => payload.locale === locale)?.id
    newButton.url = component.url?.find(url => url.locale === locale)?.id
    return newButton
  }

  renderButton(buttonStyle?: HtButtonStyle): JSX.Element {
    if (buttonStyle === HtButtonStyle.QUICK_REPLY) {
      return (
        <Reply key={this.id} payload={this.payload}>
          {this.text}
        </Reply>
      )
    }
    return (
      <Button key={this.id} payload={this.payload} url={this.url}>
        {this.text}
      </Button>
    )
  }
}
