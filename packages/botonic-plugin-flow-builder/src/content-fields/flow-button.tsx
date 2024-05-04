import { Button, Reply } from '@botonic/react'
import React from 'react'

import { FlowBuilderApi } from '../api'
import { SOURCE_INFO_SEPARATOR } from '../constants'
import { ContentFieldsBase } from './content-fields-base'
import {
  HtButton,
  HtButtonStyle,
  HtPayloadNode,
  HtUrlNode,
} from './hubtype-fields'

export class FlowButton extends ContentFieldsBase {
  public text = ''
  public url?: string
  public payload?: string

  static fromHubtypeCMS(
    cmsButton: HtButton,
    locale: string,
    cmsApi: FlowBuilderApi
  ): FlowButton {
    const urlId = this.getUrlId(cmsButton, locale)

    const newButton = new FlowButton(cmsButton.id)
    newButton.text = this.getTextByLocale(locale, cmsButton.text)
    if (cmsButton.target) {
      newButton.payload = cmsApi.getPayload(cmsButton.target)
    }

    if (cmsButton.url && urlId) {
      const urlNode = cmsApi.getNodeById<HtUrlNode>(urlId)
      newButton.url = urlNode.content.url
    }

    return newButton
  }

  static getUrlId(cmsButton: HtButton, locale: string): string | undefined {
    return cmsButton.url.find(url => url.locale === locale)?.id
  }

  renderButton(buttonIndex: number, buttonStyle?: HtButtonStyle): JSX.Element {
    if (buttonStyle === HtButtonStyle.QUICK_REPLY) {
      return (
        <Reply key={this.id} payload={this.getButtonPayload(buttonIndex)}>
          {this.text}
        </Reply>
      )
    }
    return (
      <Button
        key={this.id}
        url={this.url}
        payload={this.getButtonPayload(buttonIndex)}
      >
        {this.text}
      </Button>
    )
  }

  private getButtonPayload(buttonIndex: number): string | undefined {
    return this.payload
      ? `${this.payload}${SOURCE_INFO_SEPARATOR}${buttonIndex}`
      : undefined
  }
}
