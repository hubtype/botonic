import {
  WhatsappButtonListRowProps,
  WhatsappButtonListSectionProps,
} from '@botonic/react/lib/cjs/components/whatsapp-button-list'

import { HtWhatsappButtonListSection } from '../hubtype-fields'
import { ContentFieldsBase } from './../content-fields-base'
import { FlowWhatsappButtonListRow } from './flow-whatsapp-button-list-row'

export class FlowWhatsappButtonListSection extends ContentFieldsBase {
  public title = ''
  public rows: FlowWhatsappButtonListRow[] = []

  static fromHubtypeCMS(
    component: HtWhatsappButtonListSection,
    locale: string
  ): FlowWhatsappButtonListSection {
    const newButton = new FlowWhatsappButtonListSection(component.id)
    newButton.title = this.getTextByLocale(locale, component.title)
    newButton.rows = component.rows.map(row =>
      FlowWhatsappButtonListRow.fromHubtypeCMS(row, locale)
    )
    return newButton
  }

  toBotonic(): WhatsappButtonListSectionProps {
    const rows = this.rows.reduce((acc: WhatsappButtonListRowProps[], row) => {
      const botonicRow = row.toBotonic()
      if (botonicRow) acc.push(botonicRow)
      return acc
    }, [])

    return { title: this.title, rows }
  }
}
