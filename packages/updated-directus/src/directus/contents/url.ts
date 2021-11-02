import { PartialItem } from '@directus/sdk'
import { ContentType, SupportedLocales, Url } from '../../cms'
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
        name: entry.name ?? '',
        shortText: entry[mf][0]?.shorttext ?? undefined,
        keywords: entry[mf][0]?.keywords?.split(',') ?? undefined,
        customFields: entry[mf][0] ? getCustomFields(entry[mf][0]) : {},
      },
      url: entry[mf][0]?.url ?? '',
    }
    return new Url(opt)
  }
}
