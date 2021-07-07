import { BotonicEvent } from '@botonic/core/src/models/events'
import { User } from '@botonic/core/src/models/user'

import { DynamoDBDataProvider } from './dynamodb-data-provider'
import { LocalDevDataProvider } from './local-data-provider'

export interface DataProvider {
  getUser(id: string): User | Promise<User> | undefined
  saveUser(user: User): User | Promise<User>
  updateUser(user: User): User | Promise<User>
  getEvent(id: string): any
  saveEvent(event: BotonicEvent): BotonicEvent | Promise<BotonicEvent>
  getUserByWebsocketId(websocketId: string): User | Promise<User>
}

let localDataProvider: LocalDevDataProvider | undefined = undefined
// url: dynamodb://my-table.my-region.aws.com
// url: postgresql://my-database.my-db-provider.com
export function dataProviderFactory(url: string): DataProvider | undefined {
  const protocol = url && url.split('://')[0]
  if (!url) {
    if (!localDataProvider) localDataProvider = new LocalDevDataProvider()
    return localDataProvider
  } else if (protocol === 'dynamodb') {
    return new DynamoDBDataProvider(url)
  }
}
