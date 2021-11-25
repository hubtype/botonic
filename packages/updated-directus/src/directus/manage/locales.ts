import { DirectusClient } from '../delivery/directus-client'
import * as cms from '../../cms'
import { LocaleToBeAddedType } from '../../cms'

export class LocalesDelivery {
  readonly client: DirectusClient

  constructor(client: DirectusClient) {
    this.client = client
  }
  async getLocales(): Promise<cms.SupportedLocales[]> {
    return await this.client.getLocales()
  }

  async removeLocale(locale: cms.SupportedLocales): Promise<void> {
    await this.client.removeLocale(locale)
  }

  async addLocales(localesToBeAdded: LocaleToBeAddedType[]): Promise<void> {
    await this.client.addLocales(localesToBeAdded)
  }
}
