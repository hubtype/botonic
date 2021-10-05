import { ContentDelivery } from '../delivery'
import { DirectusClient } from '../delivery'
import {
  Button,
  CommonFields,
  Callback,
  ContentType,
  SupportedLocales,
  ContentCallback,
} from '../../cms'
import { PartialItem } from '@directus/sdk'
import { getCustomFields } from '../../directus/delivery/delivery-utils'

export class ButtonDelivery extends ContentDelivery {
  constructor(client: DirectusClient) {
    super(client, ContentType.BUTTON)
  }

  async button(id: string, context: SupportedLocales): Promise<Button> {
    const entry = await this.getEntry(id, context)
    return this.fromEntry(entry)
  }

  fromEntry(entry: PartialItem<any>, contentType?: ContentType): Button {
    const opt = {
      common: {
        id: entry.id as string,
        name: entry.name as string,
        keywords: (entry.keywords?.split(',') as string[]) ?? undefined,
        customFields: getCustomFields(entry),
      } as CommonFields,
      text: this.createButtonText(entry, contentType),
      callback: this.createButtonTarget(entry, contentType),
    }
    return new Button(opt)
  }

  private createButtonTarget(entry: any, contentType?: ContentType): Callback {
    if (contentType === ContentType.TEXT) {
      return new ContentCallback(contentType, entry.id)
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
          entry.target[0].item.id
        )
    }
  }

  private createButtonText(
    entry: PartialItem<any>,
    contentType?: ContentType
  ): string {
    if (contentType === ContentType.TEXT) {
      return entry.shorttext ?? entry.name
    } else return (entry.text as string) ?? entry.name
  }
}
