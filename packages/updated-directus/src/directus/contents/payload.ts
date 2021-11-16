import { PartialItem } from '@directus/sdk'
import { ContentType, SupportedLocales, Payload } from '../../cms'
import { getCustomFields, mf } from '../../directus/delivery/delivery-utils'
import { ContentDelivery, DirectusClient } from '../delivery'

export class PayloadDelivery extends ContentDelivery {
  constructor(client: DirectusClient) {
    super(client, ContentType.PAYLOAD)
  }

  async payload(id: string, context: SupportedLocales): Promise<Payload> {
    const entry = await this.getEntry(id, context)
    return this.fromEntry(entry)
  }

  fromEntry(entry: PartialItem<any>): Payload {
    const opt = {
      common: {
        id: entry.id as string,
        name: entry.name ?? '',
        shortText: entry[mf][0]?.shorttext ?? undefined,
        keywords: entry[mf][0]?.keywords?.split(',') ?? undefined,
        customFields: entry[mf][0] ? getCustomFields(entry[mf][0]) : {},
      },
      payload: entry[mf][0]?.payload ?? '',
    }
    return new Payload(opt)
  }
}
