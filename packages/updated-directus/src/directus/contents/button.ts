import { PartialItem } from '@directus/sdk'
import {
  Button,
  Callback,
  ContentCallback,
  ContentType,
  SupportedLocales,
} from '../../cms'
import { getCustomFields, mf } from '../../directus/delivery/delivery-utils'
import { ContentDelivery, DirectusClient } from '../delivery'

export class ButtonDelivery extends ContentDelivery {
  constructor(client: DirectusClient) {
    super(client, ContentType.BUTTON)
  }

  async button(id: string, context: SupportedLocales): Promise<Button> {
    const entry = await this.getEntry(id, context)
    return this.fromEntry(entry, ContentType.BUTTON)
  }

  fromEntry(
    entry: PartialItem<any>,
    contentType: ContentType,
    context?: SupportedLocales
  ): Button {
    if (context) this.getContextContent(entry[mf], context)
    const opt = {
      common: {
        id: entry.id,
        name: entry.name ?? '',
        keywords: entry[mf][0]?.keywords?.split(',') ?? undefined,
        customFields: entry[mf][0] ? getCustomFields(entry[mf][0]) : {},
      },
      text: this.createButtonText(entry, contentType),
      callback: entry[mf][0]
        ? this.createButtonTarget(entry[mf][0], contentType)
        : new Callback(undefined, undefined),
    }
    return new Button(opt)
  }

  private createButtonTarget(entry: any, contentType?: ContentType): Callback {
    if (contentType === ContentType.TEXT) {
      return new ContentCallback(contentType, entry.text_id)
    }
    if (contentType === ContentType.CAROUSEL) {
      return new ContentCallback(contentType, entry.carousel_id)
    }

    if (contentType === ContentType.URL) {
      return new Callback(undefined, entry.url)
    }
    const PAYLOAD_CONTENT_TYPE = 'payload'
    switch (entry.target[0].collection) {
      case PAYLOAD_CONTENT_TYPE:
        return new Callback(entry.target[0].item.payload, undefined)
      case ContentType.URL:
        return new Callback(undefined, entry.target[0].item.url)
      default:
        return new ContentCallback(
          entry.target[0].collection,
          entry.target[0].item
        )
    }
  }

  private createButtonText(
    entry: PartialItem<any>,
    contentType?: ContentType
  ): string {
    if (contentType === ContentType.BUTTON) {
      return entry[mf][0]?.text ?? entry.name
    } else return entry[mf][0]?.shorttext ?? entry.name
  }

  private getContextContent(
    entry: PartialItem<any>,
    context: SupportedLocales
  ): void {
    entry.map((content: PartialItem<any>, i: number) => {
      if (content.languages_code != context) {
        entry.splice(i, 1)
      }
    })
  }
}
