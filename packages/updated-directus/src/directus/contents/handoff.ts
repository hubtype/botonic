import { PartialItem } from '@directus/sdk'
import {
  ContentType,
  SupportedLocales,
  Handoff,
  Callback,
  ContentCallback,
} from '../../cms'
import { getCustomFields, mf } from '../../directus/delivery/delivery-utils'
import { ContentDelivery, DirectusClient } from '../delivery'
import { QueueDelivery } from './queue'

export class HandoffDelivery extends ContentDelivery {
  private readonly queue: QueueDelivery

  constructor(client: DirectusClient, queue: QueueDelivery) {
    super(client, ContentType.HANDOFF)
    this.queue = queue
  }

  async handoff(id: string, context: SupportedLocales): Promise<Handoff> {
    const entry = await this.getEntry(id, context)
    return this.fromEntry(entry, context)
  }

  fromEntry(entry: PartialItem<any>, context: SupportedLocales): Handoff {
    const queue =
      entry[mf][0] &&
      entry[mf][0].queue &&
      this.queue.fromEntry(entry[mf][0].queue, context)

    const opt = {
      common: {
        id: entry.id as string,
        name: entry.name ?? '',
        shortText: entry[mf][0]?.shorttext ?? undefined,
        keywords: entry[mf][0]?.keywords?.split(',') ?? undefined,
        customFields: entry[mf][0] ? getCustomFields(entry[mf][0]) : {},
      },
      queue: queue ?? undefined,
      message: entry[mf][0]?.handoff_message ?? '',
      failMessage: entry[mf][0]?.handoff_fail_message ?? '',
      shadowing: entry[mf][0]?.shadowing ?? false,
      onFinish: entry[mf][0]?.onfinish
        ? this.createOnFinishTarget(entry[mf][0])
        : undefined,
    }
    return new Handoff(opt)
  }

  private createOnFinishTarget(entry: any): Callback {
    switch (entry.onfinish[0].collection) {
      case ContentType.PAYLOAD:
        return new Callback(entry.onfinish[0].item.payload, undefined)
      case ContentType.URL:
        return new Callback(undefined, entry.onfinish[0].item.url)
      default:
        return new ContentCallback(
          entry.onfinish[0].collection,
          entry.onfinish[0].item
        )
    }
  }
}
