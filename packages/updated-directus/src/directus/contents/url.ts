import { ContentDelivery } from '../delivery'
import { DirectusClient } from '../delivery'
import { CommonFields, Url, ContentType, SupportedLocales } from '../../cms'
import { PartialItem } from '@directus/sdk'
import { getCustomFields } from '../../directus/delivery/delivery-utils'

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
        keywords: (entry.keywords?.split(',') as string[]) ?? undefined,
        customFields: getCustomFields(entry),
      } as CommonFields,
      url: entry.url ?? '',
    }
    return new Url(opt)
  }
}
