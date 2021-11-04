import { DirectusClient } from '../delivery/directus-client'
import * as cms from '../../cms'

export class LocalesDelivery {
  readonly client: DirectusClient

  constructor(client: DirectusClient) {
    this.client = client
  }
    async getLocales(): Promise<cms.SupportedLocales[]> {
      return await this.client.getLocales()
  }
}
