import { isWhatsapp } from '@botonic/core'
import {
  ActionRequest,
  Button,
  Text,
  WhatsappCTAUrlButton,
  WhatsappCTAUrlHeaderType,
} from '@botonic/react'
import React from 'react'

import { FlowBuilderApi } from '../api'
import { trackOneContent } from '../tracking'
import { ContentFieldsBase } from './content-fields-base'
import { FlowButton } from './flow-button'
import { HtUrlNode, HtWhatsappCTAUrlButtonNode } from './hubtype-fields'

export class FlowWhatsappCtaUrlButtonNode extends ContentFieldsBase {
  public text = ''
  public header?: string
  public headerType?: WhatsappCTAUrlHeaderType
  public headerImage?: string
  public headerVideo?: string
  public headerDocument?: string
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
    FlowWhatsappCtaUrlButtonNode.setHeader(
      whatsappCtaUrlButton,
      component,
      locale
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
    whatsappCtaUrlButton.followUp = component.follow_up

    return whatsappCtaUrlButton
  }

  private static setHeader(
    whatsappCtaUrlButton: FlowWhatsappCtaUrlButtonNode,
    component: HtWhatsappCTAUrlButtonNode,
    locale: string
  ) {
    // If header is set, set header_type to text, this is need to be compatible with the old version of the component
    if (component.content.header.length > 0) {
      component.content.header_type = WhatsappCTAUrlHeaderType.Text
    }

    whatsappCtaUrlButton.headerType = component.content
      .header_type as WhatsappCTAUrlHeaderType

    if (component.content.header_type === WhatsappCTAUrlHeaderType.Text) {
      whatsappCtaUrlButton.header = this.getTextByLocale(
        locale,
        component.content.header
      )
    }

    if (
      component.content.header_type === WhatsappCTAUrlHeaderType.Image &&
      component.content.header_image
    ) {
      whatsappCtaUrlButton.headerImage = this.getAssetByLocale(
        locale,
        component.content.header_image
      )
    }

    if (
      component.content.header_type === WhatsappCTAUrlHeaderType.Video &&
      component.content.header_video
    ) {
      whatsappCtaUrlButton.headerVideo = this.getAssetByLocale(
        locale,
        component.content.header_video
      )
    }

    if (
      component.content.header_type === WhatsappCTAUrlHeaderType.Document &&
      component.content.header_document
    ) {
      whatsappCtaUrlButton.headerDocument = this.getAssetByLocale(
        locale,
        component.content.header_document
      )
    }
  }

  async trackFlow(request: ActionRequest): Promise<void> {
    await trackOneContent(request, this)
  }

  toBotonic(id: string, request: ActionRequest): JSX.Element {
    if (!isWhatsapp(request.session)) {
      return (
        <Text>
          {this.text}
          <Button url={this.url}>{this.displayText}</Button>
        </Text>
      )
    }

    if (
      this.headerType === WhatsappCTAUrlHeaderType.Image &&
      this.headerImage
    ) {
      return (
        <WhatsappCTAUrlButton
          key={id}
          body={this.text}
          headerType={this.headerType}
          headerImage={this.headerImage}
          footer={this.footer}
          displayText={this.displayText}
          url={this.url}
        />
      )
    }

    if (
      this.headerType === WhatsappCTAUrlHeaderType.Video &&
      this.headerVideo
    ) {
      return (
        <WhatsappCTAUrlButton
          key={id}
          body={this.text}
          headerType={this.headerType}
          headerVideo={this.headerVideo}
          footer={this.footer}
          displayText={this.displayText}
          url={this.url}
        />
      )
    }

    if (
      this.headerType === WhatsappCTAUrlHeaderType.Document &&
      this.headerDocument
    ) {
      return (
        <WhatsappCTAUrlButton
          key={id}
          body={this.text}
          headerType={this.headerType}
          headerDocument={this.headerDocument}
          footer={this.footer}
          displayText={this.displayText}
          url={this.url}
        />
      )
    }

    if (this.headerType === WhatsappCTAUrlHeaderType.Text && this.header) {
      return (
        <WhatsappCTAUrlButton
          key={id}
          body={this.text}
          header={this.header}
          headerType={this.headerType}
          footer={this.footer}
          displayText={this.displayText}
          url={this.url}
        />
      )
    }

    return (
      <WhatsappCTAUrlButton
        key={id}
        body={this.text}
        footer={this.footer}
        displayText={this.displayText}
        url={this.url}
      />
    )
  }
}
