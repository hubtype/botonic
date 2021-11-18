import { PartialItem } from '@directus/sdk'
import { ContentType, SupportedLocales, ScheduleContent } from '../../cms'
import { getCustomFields, mf } from '../../directus/delivery/delivery-utils'
import { ContentDelivery, DirectusClient } from '../delivery'

export class ScheduleDelivery extends ContentDelivery {
  constructor(client: DirectusClient) {
    super(client, ContentType.PAYLOAD)
  }

  async schedule(
    id: string,
    context: SupportedLocales
  ): Promise<ScheduleContent> {
    const entry = await this.getEntry(id, context)
    return this.fromEntry(entry)
  }

  fromEntry(entry: PartialItem<any>): ScheduleContent {
    const opt = {
      common: {
        id: entry.id as string,
        name: entry.name ?? '',
        shortText: entry[mf][0]?.shorttext ?? undefined,
        keywords: entry[mf][0]?.keywords?.split(',') ?? undefined,
        customFields: entry[mf][0] ? getCustomFields(entry[mf][0]) : {},
      },
      schedule: entry[mf][0]?.schedule ?? undefined,
    }
    return new ScheduleContent(opt)
  }
}
