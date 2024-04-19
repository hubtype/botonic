import { WhatsappCTAUrlButton } from '@botonic/react'
import React from 'react'

import { FlowBuilderApi } from '../api'
import { ContentFieldsBase } from './content-fields-base'
import { FlowButton } from './flow-button'
import { HtUrlNode } from './hubtype-fields'
import { HtWhatsappCTAUrlButtonNode } from './hubtype-fields/whatsapp-cta-url-button'

export class FlowWhatsappCtaUrlButtonNode extends ContentFieldsBase {
  public code = ''
  public text = ''
  public header?: string
  public footer?: string
  public displayText = ''
  public url: string = ''

  static fromHubtypeCMS(
    component: HtWhatsappCTAUrlButtonNode,
    locale: string,
    cmsApi: FlowBuilderApi
  ): FlowWhatsappCtaUrlButtonNode {
    const whatsappCtaUrlButton = new FlowWhatsappCtaUrlButtonNode(component.id)
    whatsappCtaUrlButton.code = component.code
    whatsappCtaUrlButton.text = this.getTextByLocale(
      locale,
      component.content.text
    )
    whatsappCtaUrlButton.header = this.getTextByLocale(
      locale,
      component.content.header
    )
    whatsappCtaUrlButton.footer = this.getTextByLocale(
      locale,
      component.content.footer
    )
    const button = FlowButton.fromHubtypeCMS(
      component.content.button,
      locale,
      cmsApi
    )
    whatsappCtaUrlButton.displayText = button.text
    const urlId = FlowButton.getUrlId(component.content.button, locale)
    if (urlId) {
      const urlNode = cmsApi.getNodeById<HtUrlNode>(urlId)
      whatsappCtaUrlButton.url = urlNode.content.url
    }
    return whatsappCtaUrlButton
  }

  toBotonic(id: string): JSX.Element {
    return (
      <WhatsappCTAUrlButton
        key={id}
        body={this.text}
        header={this.header}
        footer={this.footer}
        displayText={this.displayText}
        url={this.url}
      />
    )
  }
}
