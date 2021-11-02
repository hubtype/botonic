import { PartialItem } from '@directus/sdk'

import * as cms from '../../cms'
import { Image } from '../../cms'
import { getCustomFields, mf } from '../../directus/delivery/delivery-utils'
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
        id: entry.id,
        name: entry.name ?? '',
        shortText: entry[mf][0]?.shorttext ?? undefined,
        keywords: entry[mf][0]?.keywords?.split(',') ?? undefined,
        customFields: entry[mf][0] ? getCustomFields(entry[mf][0]) : {},
      },
      imgUrl: entry[mf][0]
        ? `${this.client.clientParams.credentials.apiEndPoint}assets/${entry[mf][0]?.image}`
        : '',
    }
    return new Image(opt)
  }
}
