import type {
  WhatsappButtonListRowProps,
  WhatsappButtonListSectionProps,
} from '@botonic/react'

import type { FlowBuilderApi } from '../../api'
import { ContentFieldsBase } from '../content-fields-base'
import type { HtWhatsappButtonListSection } from '../hubtype-fields'
import { FlowWhatsappButtonListRow } from './flow-whatsapp-button-list-row'

export class FlowWhatsappButtonListSection extends ContentFieldsBase {
  public title = ''
  public rows: FlowWhatsappButtonListRow[] = []

  static fromHubtypeCMS(
    component: HtWhatsappButtonListSection,
    locale: string,
    cmsApi: FlowBuilderApi
  ): FlowWhatsappButtonListSection {
    const newButton = new FlowWhatsappButtonListSection(component.id)
    newButton.title = FlowWhatsappButtonListSection.getTextByLocale(
      locale,
      component.title
    )
    newButton.rows = component.rows.map(row =>
      FlowWhatsappButtonListRow.fromHubtypeCMS(row, locale, cmsApi)
    )
    return newButton
  }

  async trackFlow(): Promise<void> {
    return
  }

  async processContent(): Promise<void> {
    return
  }

  renderSection(sectionIndex: number): WhatsappButtonListSectionProps {
    const rows = this.rows.reduce(
      (acc: WhatsappButtonListRowProps[], row, rowIndex) => {
        const botonicRow = row.renderRow(rowIndex, sectionIndex)
        if (botonicRow) {
          acc.push(botonicRow)
        }
        return acc
      },
      []
    )

    return { title: this.title, rows }
  }
}
