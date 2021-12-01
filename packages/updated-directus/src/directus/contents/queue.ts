import { PartialItem } from '@directus/sdk'
import { ContentType, SupportedLocales, Queue } from '../../cms'
import { getCustomFields, mf } from '../../directus/delivery/delivery-utils'
import { ContentDelivery, DirectusClient } from '../delivery'
import { ScheduleDelivery } from './schedule'

export class QueueDelivery extends ContentDelivery {
  private readonly schedule: ScheduleDelivery

  constructor(client: DirectusClient, schedule: ScheduleDelivery) {
    super(client, ContentType.QUEUE)
    this.schedule = schedule
  }

  async queue(id: string, context: SupportedLocales): Promise<Queue> {
    const entry = await this.getEntry(id, context)
    return this.fromEntry(entry, context)
  }

  fromEntry(entry: PartialItem<any>, context: SupportedLocales): Queue {
    const schedule =
      entry[mf][0] &&
      entry[mf][0].schedule.length &&
      this.schedule.fromEntry(entry[mf][0].schedule, context)

    const opt = {
      common: {
        id: entry.id as string,
        name: entry.name ?? '',
        shortText: entry[mf][0]?.shorttext ?? undefined,
        keywords: entry[mf][0]?.keywords?.split(',') ?? undefined,
        customFields: entry[mf][0] ? getCustomFields(entry[mf][0]) : {},
      },
      queue: entry[mf][0]?.botonic_queue_name ?? '',
      schedule: schedule ?? undefined,
    }
    return new Queue(opt)
  }
}
