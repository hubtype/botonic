import { PartialItem } from '@directus/sdk'

import * as cms from '../../cms'
import { CommonFields, Image } from '../../cms'
import { getCustomFields } from '../../directus/delivery/delivery-utils'
import { ContentDelivery, DirectusClient } from '../delivery'

export class ImageDelivery extends ContentDelivery {
  constructor(client: DirectusClient) {
    super(client, cms.ContentType.IMAGE)
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
      imgUrl: `${this.client.clientParams.credentials.apiEndPoint}assets/${entry.image}`,
    }
    return new Image(opt)
  }
}
