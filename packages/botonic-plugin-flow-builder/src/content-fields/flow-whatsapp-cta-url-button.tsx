import { isWhatsapp } from '@botonic/core'
import {
  type ActionRequest,
  Button,
  Text,
  WhatsappCTAUrlButton,
  WhatsappCTAUrlHeaderType,
} from '@botonic/react'

import type { FlowBuilderApi } from '../api'
import { trackOneContent } from '../tracking'
import { ContentFieldsBase } from './content-fields-base'
import { FlowButton } from './flow-button'
import type { HtUrlNode, HtWhatsappCTAUrlButtonNode } from './hubtype-fields'

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
    whatsappCtaUrlButton.text = FlowWhatsappCtaUrlButtonNode.getTextByLocale(
      locale,
      component.content.text
    )
    FlowWhatsappCtaUrlButtonNode.setHeader(
      whatsappCtaUrlButton,
      component,
      locale
    )
    whatsappCtaUrlButton.footer = FlowWhatsappCtaUrlButtonNode.getTextByLocale(
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
      whatsappCtaUrlButton.header =
        FlowWhatsappCtaUrlButtonNode.getTextByLocale(
          locale,
          component.content.header
        )
    }

    if (
      component.content.header_type === WhatsappCTAUrlHeaderType.Image &&
      component.content.header_image
    ) {
      whatsappCtaUrlButton.headerImage =
        FlowWhatsappCtaUrlButtonNode.getAssetByLocale(
          locale,
          component.content.header_image
        )
    }

    if (
      component.content.header_type === WhatsappCTAUrlHeaderType.Video &&
      component.content.header_video
    ) {
      whatsappCtaUrlButton.headerVideo =
        FlowWhatsappCtaUrlButtonNode.getAssetByLocale(
          locale,
          component.content.header_video
        )
    }

    if (
      component.content.header_type === WhatsappCTAUrlHeaderType.Document &&
      component.content.header_document
    ) {
      whatsappCtaUrlButton.headerDocument =
        FlowWhatsappCtaUrlButtonNode.getAssetByLocale(
          locale,
          component.content.header_document
        )
    }
  }

  async trackFlow(request: ActionRequest): Promise<void> {
    await trackOneContent(request, this)
  }

  toBotonic(id: string, request: ActionRequest): JSX.Element {
    const replacedText = this.replaceVariables(this.text, request)

    if (!isWhatsapp(request.session)) {
      return (
        <Text>
          {replacedText}
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
          body={replacedText}
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
          body={replacedText}
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
          body={replacedText}
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
          body={replacedText}
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
        body={replacedText}
        footer={this.footer}
        displayText={this.displayText}
        url={this.url}
      />
    )
  }
}
