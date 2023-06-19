import { WhatsappButtonListRowProps } from '@botonic/react'

import { ContentFieldsBase } from '../content-fields-base'
import { HtWhatsappButtonListRow } from '../hubtype-fields'

export class FlowWhatsappButtonListRow extends ContentFieldsBase {
  public title = ''
  public description = ''
  public targetId?: string

  static fromHubtypeCMS(
    component: HtWhatsappButtonListRow,
    locale: string
  ): FlowWhatsappButtonListRow {
    const newRow = new FlowWhatsappButtonListRow(component.id)
    newRow.title = this.getTextByLocale(locale, component.text)
    newRow.description = this.getTextByLocale(locale, component.description)
    newRow.targetId = component.target?.id
    return newRow
  }

  toBotonic(): WhatsappButtonListRowProps | undefined {
    if (!this.targetId) {
      console.error(`Row with title: '${this.title}' has no target`)
      return undefined
    }
    return {
      id: this.targetId,
      title: this.title,
      description: this.description,
    }
  }
}
