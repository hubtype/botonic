import type { WhatsappButtonListRowProps } from '@botonic/react'

import type { FlowBuilderApi } from '../../api'
import { SOURCE_INFO_SEPARATOR } from '../../constants'
import { ContentFieldsBase } from '../content-fields-base'
import type { HtWhatsappButtonListRow } from '../hubtype-fields'

export class FlowWhatsappButtonListRow extends ContentFieldsBase {
  public title = ''
  public description = ''
  public targetId?: string

  static fromHubtypeCMS(
    component: HtWhatsappButtonListRow,
    locale: string,
    cmsApi: FlowBuilderApi
  ): FlowWhatsappButtonListRow {
    const newRow = new FlowWhatsappButtonListRow(component.id)
    newRow.title = FlowWhatsappButtonListRow.getTextByLocale(
      locale,
      component.text
    )
    newRow.description = FlowWhatsappButtonListRow.getTextByLocale(
      locale,
      component.description
    )
    newRow.targetId = cmsApi.getPayload(component.target)

    return newRow
  }

  async trackFlow(): Promise<void> {
    return
  }

  async processContent(): Promise<void> {
    return
  }

  renderRow(
    rowIndex: number,
    sectionIndex: number
  ): WhatsappButtonListRowProps | undefined {
    if (!this.targetId) {
      console.error(`Row with title: '${this.title}' has no target`)
      return undefined
    }
    return {
      id: this.getRowId(rowIndex, sectionIndex),
      title: this.title,
      description: this.description,
    }
  }

  private getRowId(rowIndex: number, sectionIndex: number): string {
    return `${this.targetId}${SOURCE_INFO_SEPARATOR}${sectionIndex}.${rowIndex}`
  }
}
