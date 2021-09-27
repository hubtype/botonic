import { DirectusClient } from '../delivery/directusClient'
import * as cms from '../../cms'
import { Content } from '../../cms'
import { PartialItem } from '@directus/sdk'
import { TextDelivery } from '../contents/text'
import { ImageDelivery } from '../contents/image'

export interface ContentDeliveries {
  [cms.MessageContentType.TEXT]: TextDelivery
  [cms.MessageContentType.IMAGE]: ImageDelivery
}

export class ContentsDelivery {
  readonly client: DirectusClient
  readonly ContentDeliveries: ContentDeliveries
  constructor(client: DirectusClient, ContentDeliveries: ContentDeliveries) {
    this.client = client
    this.ContentDeliveries = ContentDeliveries
  }

  async topContents(
    contentType: cms.MessageContentType,
    context: cms.SupportedLocales
  ): Promise<Content[]> {
    const entries = await this.client.topContents(contentType, context)
    return this.fromEntry(entries, contentType, context)
  }

  fromEntry(
    entries: PartialItem<any>[],
    contentType: cms.MessageContentType,
    context: cms.SupportedLocales
  ): Content[] {
    let convertedEntries: Content[] = []
    entries.forEach((entry: PartialItem<any>) => {
      convertedEntries.push(
        this.ContentDeliveries[contentType].fromEntry(entry, context)
      )
    })

    return convertedEntries
  }
}
