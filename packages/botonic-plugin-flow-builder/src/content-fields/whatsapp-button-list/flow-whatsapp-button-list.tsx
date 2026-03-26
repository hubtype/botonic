import { type BotContext, isWhatsapp } from '@botonic/core'
import { Button, Text, WhatsappButtonList } from '@botonic/react'

import type { FlowBuilderApi } from '../../api'
import { trackOneContent } from '../../tracking'
import { ContentFieldsBase } from '../content-fields-base'
import type { HtWhatsappButtonListNode } from '../hubtype-fields'
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
    newWhatsappButtonList.text = FlowWhatsappButtonList.getTextByLocale(
      locale,
      component.content.text
    )
    newWhatsappButtonList.listButtonText =
      FlowWhatsappButtonList.getTextByLocale(
        locale,
        component.content.button_text
      )
    newWhatsappButtonList.sections = component.content.sections.map(section =>
      FlowWhatsappButtonListSection.fromHubtypeCMS(section, locale, cmsApi)
    )
    newWhatsappButtonList.followUp = component.follow_up

    return newWhatsappButtonList
  }

  async trackFlow(botContext: BotContext): Promise<void> {
    await trackOneContent(botContext, this)
  }

  async processContent(botContext: BotContext): Promise<void> {
    await this.trackFlow(botContext)
    return
  }

  toBotonic(botContext: BotContext): JSX.Element {
    const replacedText = this.replaceVariables(this.text, botContext)

    if (!isWhatsapp(botContext.session)) {
      const rows = this.sections.flatMap(section => section.rows)
      const buttons = rows.map(row => (
        <Button key={row.id} payload={row.targetId}>
          {row.title}
        </Button>
      ))

      return (
        <Text>
          {replacedText}
          {buttons}
        </Text>
      )
    }

    return (
      <WhatsappButtonList
        key={this.id}
        body={replacedText}
        button={this.listButtonText}
        sections={this.sections.map((section, sectionIndex) =>
          section.toBotonic(sectionIndex)
        )}
      />
    )
  }
}
