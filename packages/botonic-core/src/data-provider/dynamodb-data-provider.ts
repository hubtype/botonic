import { Entity, Table } from 'dynamodb-toolbox'

import { BotonicEvent, EventTypes, User } from '../models'
import {
  getConnectionEventEntity,
  getMessageEventEntities,
  getUserEntity,
  getUserEventsTable,
  GLOBAL_SECONDARY_INDEX_NAME,
  SORT_KEY_NAME,
  USER_PREFIX,
} from './dynamodb-utils'
import { DataProvider } from './factory'

export class DynamoDBDataProvider implements DataProvider {
  region: string
  tableName: string
  userEventsTable: Table
  userEntity: Entity<any>
  eventEntity: Entity<any>
  messageEventEntities: Record<string, Entity<any>>
  textMessageEventEntity: Entity<any>
  connectionEventEntity: Entity<any>
  constructor(url: string) {
    try {
      const urlParts = url.split('://')[1].split('.')
      this.tableName = urlParts[0]
      this.region = urlParts[1]
      this.userEventsTable = getUserEventsTable(this.tableName, this.region)
      this.userEntity = getUserEntity(this.userEventsTable)
      this.connectionEventEntity = getConnectionEventEntity(
        this.userEventsTable
      )
      this.messageEventEntities = getMessageEventEntities(this.userEventsTable)
    } catch (e) {
      console.log({ e })
    }
  }

  // @ts-ignore
  async getUsers(limit = 10, offset = 0): Promise<User[]> {
    // TODO: finish to implement with offset
    const result = await this.userEventsTable.scan({
      filters: { attr: SORT_KEY_NAME, beginsWith: USER_PREFIX },
      limit,
    })
    return result.Items
  }

  async getUser(id: string): Promise<User | undefined> {
    const userById = {
      id: id,
      SK: id,
    }
    const result = await this.userEntity.get(userById)
    if (Object.keys(result).length === 0) return undefined
    return result.Item
  }

  async getUserByWebsocketId(websocketId: string): Promise<User | undefined> {
    const result = await this.userEventsTable.query(websocketId, {
      index: GLOBAL_SECONDARY_INDEX_NAME,
    })
    if (result.Count === 0) return undefined
    return result.Items[0]
  }
  // @ts-ignore
  async getUserByField(field: string, value: any): Promise<User | undefined> {} //TODO: Implement

  async saveUser(user: User): Promise<User> {
    const putUser = { ...user, id: user.id, userId: user.id }
    await this.userEntity.put(putUser)
    return user
  }
  async updateUser(user: User): Promise<User> {
    const updateUser = { ...user, id: user.id, userId: user.id }
    const res = await this.userEntity.update(updateUser)
    return user
  }
  // @ts-ignore
  async deleteUser(id: string): Promise<User | undefined> {} // TODO: Implement

  // @ts-ignore
  async getEvents(limit = 10, offset = 0): Promise<BotonicEvent[]> {} // TODO: Implement

  // @ts-ignore
  async getEvent(id: string): Promise<BotonicEvent | undefined> {} // TODO: Implement

  async saveEvent(event: BotonicEvent): Promise<BotonicEvent> {
    if (event.eventType === EventTypes.CONNECTION) {
      await this.connectionEventEntity.put(event)
    }
    if (event.eventType === EventTypes.MESSAGE) {
      await this.messageEventEntities[event.type].put(event)
    }
    // TODO: Implementation of other event types
    return event
  }

  // @ts-ignore
  async updateEvent(event: BotonicEvent): Promise<BotonicEvent> {} // TODO: Implement

  // @ts-ignore
  async deleteEvent(id: string): Promise<BotonicEvent | undefined> {} // TODO: Implement
}
