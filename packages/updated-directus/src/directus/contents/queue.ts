import { PartialItem } from '@directus/sdk'
import { ContentType, SupportedLocales, Queue } from '../../cms'
import { getCustomFields, mf } from '../../directus/delivery/delivery-utils'
import { ContentDelivery, DirectusClient } from '../delivery'

export class QueueDelivery extends ContentDelivery {
  constructor(client: DirectusClient) {
    super(client, ContentType.PAYLOAD)
  }

  async queue(id: string, context: SupportedLocales): Promise<Queue> {
    const entry = await this.getEntry(id, context)
    return this.fromEntry(entry)
  }

  fromEntry(entry: PartialItem<any>): Queue {
    const opt = {
      common: {
        id: entry.id as string,
        name: entry.name ?? '',
        shortText: entry[mf][0]?.shorttext ?? undefined,
        keywords: entry[mf][0]?.keywords?.split(',') ?? undefined,
        customFields: entry[mf][0] ? getCustomFields(entry[mf][0]) : {},
      },
      queue: entry[mf][0]?.queue ?? '',
      schedule: entry[mf][0]?.schedule ?? undefined,
    }
    return new Queue(opt)
  }
}
