import { isWhatsapp } from '@botonic/core'
import { ActionRequest, Button, Text, WhatsappButtonList } from '@botonic/react'
import React from 'react'

import { FlowBuilderApi } from '../../api'
import { trackOneContent } from '../../tracking'
import { ContentFieldsBase } from '../content-fields-base'
import { HtWhatsappButtonListNode } from '../hubtype-fields'
import { FlowWhatsappButtonListSection } from './flow-whatsapp-button-list-section'

export class FlowWhatsappButtonList extends ContentFieldsBase {
  public text = ''
  public listButtonText = ''
  public sections: FlowWhatsappButtonListSection[] = []

  static fromHubtypeCMS(
    component: HtWhatsappButtonListNode,
    locale: string,
    cmsApi: FlowBuilderApi
  ): FlowWhatsappButtonList {
    const newWhatsappButtonList = new FlowWhatsappButtonList(component.id)
    newWhatsappButtonList.code = component.code
    newWhatsappButtonList.text = this.getTextByLocale(
      locale,
      component.content.text
    )
    newWhatsappButtonList.listButtonText = this.getTextByLocale(
      locale,
      component.content.button_text
    )
    newWhatsappButtonList.sections = component.content.sections.map(section =>
      FlowWhatsappButtonListSection.fromHubtypeCMS(section, locale, cmsApi)
    )
    newWhatsappButtonList.followUp = component.follow_up

    return newWhatsappButtonList
  }

  async trackFlow(request: ActionRequest): Promise<void> {
    await trackOneContent(request, this)
  }

  toBotonic(id: string, request: ActionRequest): JSX.Element {
    if (!isWhatsapp(request.session)) {
      const rows = this.sections.flatMap(section => section.rows)
      const buttons = rows.map(row => (
        <Button key={row.id} payload={row.targetId}>
          {row.title}
        </Button>
      ))

      return (
        <Text>
          {this.text}
          {buttons}
        </Text>
      )
    }

    return (
      <WhatsappButtonList
        key={id}
        body={this.text}
        button={this.listButtonText}
        sections={this.sections.map((section, sectionIndex) =>
          section.toBotonic(sectionIndex)
        )}
      ></WhatsappButtonList>
    )
  }
}
