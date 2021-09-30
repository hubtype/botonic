import { ContentDelivery } from '../delivery'
import { DirectusClient } from '../delivery'
import * as cms from '../../cms'
import { CommonFields, Image } from '../../cms'
import { PartialItem } from '@directus/sdk'
import { getCustomFields } from '../../directus/delivery/delivery-utils'

export class ImageDelivery extends ContentDelivery {
  constructor(client: DirectusClient) {
    super(client, cms.MessageContentType.IMAGE)
  }

  async image(id: string, context: cms.SupportedLocales): Promise<Image> {
    const entry = await this.getEntry(id, context)
    return this.fromEntry(entry, context)
  }

  fromEntry(entry: PartialItem<any>, context?: cms.SupportedLocales): Image {
    const opt = {
      common: {
        id: entry.id as string,
        name: entry.name as string,
        keywords: (entry.keywords?.split(',') as string[]) ?? undefined,
        customFields: getCustomFields(entry),
      } as CommonFields,
      image: `${this.client.clientParams.credentials.apiEndPoint}assets/${entry.image}`,
    }
    return new Image(opt)
  }
}
