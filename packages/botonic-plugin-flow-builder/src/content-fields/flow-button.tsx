import { Button, Reply } from '@botonic/react'
import React from 'react'

import { FlowBuilderApi } from '../api'
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
    const payloadId = this.getPayloadId(cmsButton, locale)
    const urlId = this.getUrlId(cmsButton, locale)

    const newButton = new FlowButton(cmsButton.id)
    newButton.text = this.getTextByLocale(locale, cmsButton.text)
    if (cmsButton.target) {
      newButton.payload = cmsButton.target.id
    }
    if (cmsButton.payload && payloadId) {
      const payloadNode = cmsApi.getNode(payloadId) as HtPayloadNode
      newButton.payload = payloadNode.content.payload
    }
    if (cmsButton.url && urlId) {
      const payloadNode = cmsApi.getNode(urlId) as HtUrlNode
      newButton.url = payloadNode.content.url
    }

    return newButton
  }

  static getPayloadId(cmsButton, locale): string | undefined {
    return cmsButton.payload.find(payload => payload.locale === locale)?.id
  }

  static getUrlId(cmsButton, locale): string | undefined {
    return cmsButton.url.find(url => url.locale === locale)?.id
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
