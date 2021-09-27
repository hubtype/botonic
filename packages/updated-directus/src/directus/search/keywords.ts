import { DirectusClient } from '../delivery/directusClient'

export class KeywordsDelivery {
  readonly client: DirectusClient

  constructor(client: DirectusClient) {
    this.client = client
  }

  async contentsWithKeywords(input: string): Promise<string[]> {
    return await this.client.contentsWithKeywords(input)
  }
}
