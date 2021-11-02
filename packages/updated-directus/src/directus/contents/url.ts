import { PartialItem } from '@directus/sdk'

import { CommonFields, ContentType, SupportedLocales, Url } from '../../cms'
import { getCustomFields, mf } from '../../directus/delivery/delivery-utils'
import { ContentDelivery, DirectusClient } from '../delivery'

export class UrlDelivery extends ContentDelivery {
  constructor(client: DirectusClient) {
    super(client, ContentType.URL)
  }

  async url(id: string, context: SupportedLocales): Promise<Url> {
    const entry = await this.getEntry(id, context)
    return this.fromEntry(entry)
  }

  fromEntry(entry: PartialItem<any>): Url {
    const opt = {
      common: {
        id: entry.id as string,
        name: entry.name as string,
        shortText: (entry[mf][0].shorttext as string) ?? undefined,
        keywords: (entry[mf][0].keywords?.split(',') as string[]) ?? undefined,
        customFields: getCustomFields(entry[mf][0]),
      } as CommonFields,
      url: entry[mf][0].url ?? '',
    }
    return new Url(opt)
  }
}
