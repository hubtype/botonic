import { PartialItem } from '@directus/sdk'

import * as cms from '../../cms'
import { DirectusClient } from './directus-client'

export abstract class ContentDelivery {
  protected readonly client: DirectusClient
  private contentType: cms.ContentType

  constructor(client: DirectusClient, contentType: cms.ContentType) {
    this.client = client
    this.contentType = contentType
  }

  async getEntry(
    id: string,
    context: cms.SupportedLocales
  ): Promise<PartialItem<any>> {
    return await this.client.getEntry(id, this.contentType, context)
  }
}
