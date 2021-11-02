import { PartialItem } from '@directus/sdk'

import * as cms from '../../cms'
import { CommonFields, Image } from '../../cms'
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
        id: entry.id as string,
        name: entry.name as string,
        shortText: (entry[mf][0].shorttext as string) ?? undefined,
        keywords: (entry[mf][0].keywords?.split(',') as string[]) ?? undefined,
        customFields: getCustomFields(entry[mf][0]),
      } as CommonFields,
      imgUrl: `${this.client.clientParams.credentials.apiEndPoint}assets/${entry[mf][0].image}`,
    }
    return new Image(opt)
  }
}
