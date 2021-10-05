import { ContentDelivery } from '../delivery'
import { DirectusClient } from '../delivery'
import * as cms from '../../cms'
import { Button, CommonFields } from '../../cms'
import { PartialItem } from '@directus/sdk'
import { getCustomFields } from '../../directus/delivery/delivery-utils'

export class ButtonDelivery extends ContentDelivery {
  constructor(client: DirectusClient) {
    super(client, cms.ContentType.BUTTON)
  }

  async button(id: string, context: cms.SupportedLocales): Promise<Button> {
    const entry = await this.getEntry(id, context)
    return this.fromEntry(entry)
  }

  fromEntry(entry: PartialItem<any>, contentType?: cms.ContentType): Button {
    const opt = {
      common: {
        id: entry.id as string,
        name: entry.name as string,
        keywords: (entry.keywords?.split(',') as string[]) ?? undefined,
        customFields: getCustomFields(entry),
      } as CommonFields,
      text: this.createButtonText(entry, contentType),
      target: this.createButtonTarget(entry, contentType),
    }
    return new Button(opt)
  }

  private createButtonTarget(
    entry: any,
    contentType?: cms.ContentType
  ): string {
    if (contentType === cms.ContentType.TEXT) {
      return `${contentType}$${entry.id}`
    }
    const PAYLOAD_CONTENT_TYPE = 'payload'
    switch (entry.target[0].collection) {
      case PAYLOAD_CONTENT_TYPE:
        return entry.target[0].item.payload
      default:
        return `${entry.target[0].collection}$${entry.target[0].item.id}`
    }
  }

  private createButtonText(
    entry: PartialItem<any>,
    contentType?: cms.ContentType
  ): string {
    if (contentType === cms.ContentType.TEXT) {
      return entry.shorttext ?? entry.name
    } else return (entry.text as string) ?? entry.name
  }
}
