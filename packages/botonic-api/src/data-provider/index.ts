import { BotonicEvent } from '@botonic/core/src/models/events'
import { User } from '@botonic/core/src/models/user'

import { DynamoDBDataProvider } from './dynamodb-data-provider'
import { LocalDevDataProvider } from './local-data-provider'

export const dataProviderProtocols = {
  DYNAMO_DB: 'dynamodb',
}

export interface DataProvider {
  getUsers(limit?: number, offset?: number): User[] | Promise<User[]>
  getUser(id: string): User | Promise<User | undefined> | undefined
  saveUser(user: User): User | Promise<User>
  updateUser(user: User): User | Promise<User>
  getEvents(
    limit?: number,
    offset?: number
  ): BotonicEvent[] | Promise<BotonicEvent[]>
  getEvent(
    id: string
  ): BotonicEvent | Promise<BotonicEvent | undefined> | undefined
  saveEvent(event: BotonicEvent): BotonicEvent | Promise<BotonicEvent>
  getUserByWebsocketId(
    websocketId: string
  ): User | Promise<User | undefined> | undefined
}

const localDataProvider: LocalDevDataProvider | undefined = undefined
// url: dynamodb://my-table.my-region.aws.com
// url: postgresql://my-database.my-db-provider.com
export function dataProviderFactory(url?: string): DataProvider {
  if (!url) {
    return localDataProvider ?? new LocalDevDataProvider()
  }

  const protocol = url.split('://')[0]
  switch (protocol) {
    case dataProviderProtocols.DYNAMO_DB:
      return new DynamoDBDataProvider(url)
    default:
      return localDataProvider ?? new LocalDevDataProvider()
  }
}
