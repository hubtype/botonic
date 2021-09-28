import { BotonicEvent, User } from '../models'
import { DynamoDBDataProvider } from './dynamodb-data-provider'
import { LocalDevDataProvider } from './local-data-provider'

export const dataProviderProtocols = {
  DYNAMO_DB: 'dynamodb',
  FILE: 'file',
}

export interface DataProvider {
  getUsers(limit?: number, offset?: number): User[] | Promise<User[]>
  getUser(id: string): User | Promise<User | undefined> | undefined
  //TODO: replace getUserByWebsocketId to getUserByField?
  getUserByWebsocketId(
    websocketId: string
  ): User | Promise<User | undefined> | undefined
  getUserByField(
    field: string,
    value: any
  ): User | Promise<User | undefined> | undefined
  saveUser(user: User): User | Promise<User>
  updateUser(user: User): User | Promise<User>
  deleteUser(id: string): User | Promise<User | undefined> | undefined
  getEvents(
    limit?: number,
    offset?: number
  ): BotonicEvent[] | Promise<BotonicEvent[]>
  getEvent(
    id: string
  ): BotonicEvent | Promise<BotonicEvent | undefined> | undefined
  saveEvent(event: BotonicEvent): BotonicEvent | Promise<BotonicEvent>
  updateEvent(event: BotonicEvent): BotonicEvent | Promise<BotonicEvent>
  deleteEvent(
    id: string
  ): BotonicEvent | Promise<BotonicEvent | undefined> | undefined
}

/** URL examples:
 * dynamodb://my-table.my-region.aws.com
 * postgresql://my-database.my-db-provider.com
 * file://path/to/local/db.json
 */
export function dataProviderFactory(url?: string): DataProvider {
  if (!url) {
    return new LocalDevDataProvider()
  }

  const protocol = url.split('://')[0]
  switch (protocol) {
    case dataProviderProtocols.DYNAMO_DB:
      return new DynamoDBDataProvider(url)
    case dataProviderProtocols.FILE:
      return new LocalDevDataProvider(url)
    default:
      console.error(
        `Protocol ${protocol} not implemented, using local DB instead.`
      )
      return new LocalDevDataProvider()
  }
}
