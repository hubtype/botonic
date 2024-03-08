import { WhatsappButtonList } from '@botonic/react'
import React from 'react'

import { FlowBuilderApi } from '../../api'
import { HtWhatsappButtonListNode } from '../hubtype-fields'
import { ContentFieldsBase } from './../content-fields-base'
import { FlowWhatsappButtonListSection } from './flow-whatsapp-button-list-section'

export class FlowWhatsappButtonList extends ContentFieldsBase {
  public code = ''
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
    return newWhatsappButtonList
  }

  toBotonic(id: string): JSX.Element {
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
