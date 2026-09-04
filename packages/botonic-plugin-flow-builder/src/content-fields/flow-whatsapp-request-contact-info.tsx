import { type BotContext, isWhatsapp } from '@botonic/core'
import { Text, WhatsappRequestContactInfo } from '@botonic/react'

import { trackOneContent } from '../tracking'
import { ContentFieldsBase } from './content-fields-base'
import type { HtWhatsappRequestContactInfoNode } from './hubtype-fields'

export class FlowWhatsappRequestContactInfoNode extends ContentFieldsBase {
  public text = ''

  static fromHubtypeCMS(
    component: HtWhatsappRequestContactInfoNode,
    locale: string
  ): FlowWhatsappRequestContactInfoNode {
    const requestContactInfo = new FlowWhatsappRequestContactInfoNode(
      component.id
    )
    requestContactInfo.code = component.code
    requestContactInfo.text =
      FlowWhatsappRequestContactInfoNode.getTextByLocale(
        locale,
        component.content.text
      )
    requestContactInfo.followUp = component.follow_up

    return requestContactInfo
  }

  async trackFlow(botContext: BotContext): Promise<void> {
    await trackOneContent(botContext, this)
  }

  async processContent(botContext: BotContext): Promise<void> {
    await this.filterContent(botContext, this)
    await this.trackFlow(botContext)
    return
  }

  toBotonic(botContext: BotContext): JSX.Element {
    const replacedText = this.replaceVariables(this.text, botContext)

    if (!isWhatsapp(botContext.session)) {
      return <Text>{replacedText}</Text>
    }

    return (
      <WhatsappRequestContactInfo key={this.id} body={replacedText} />
    )
  }
}
