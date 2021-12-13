import { DirectusClient } from '../delivery/directus-client'

export class EnvironmentsDelivery {
  readonly client: DirectusClient

  constructor(client: DirectusClient) {
    this.client = client
  }

  async getEnvironments(): Promise<Environment[]> {
    return await this.client.getEnvironments()
  }

  async deleteEnvironment(environmentId: string): Promise<void> {
    await this.client.deleteEnvironment(environmentId)
  }

  async getEnvironment(
    environmentId: string
  ): Promise<Environment | undefined> {
    return await this.client.getEnvironment(environmentId)
  }

  async createEnvironmentWithId(
    environmentId: string
  ): Promise<Environment | undefined> {
    return await this.client.createEnvironmentWithId(environmentId)
  }
}

export class Environment {
  readonly name: string
  readonly alias: Environment | undefined
  constructor(name: string, alias: Environment | undefined) {
    this.name = name
    this.alias = alias ?? undefined
  }
}
