import { BotonicEvent, EventTypes } from '@botonic/core/src/models/events'
import { User } from '@botonic/core/src/models/user'
import { Entity, Table } from 'dynamodb-toolbox'

import { DataProvider } from '.'
import {
  getConnectionEntity,
  getMessageEventEntities,
  getUserEntity,
  getUserEventsTable,
  GLOBAL_SECONDARY_INDEX_NAME,
  SORT_KEY_NAME,
} from './dynamodb-utils'

export class DynamoDBDataProvider implements DataProvider {
  region: string
  tableName: string
  userEventsTable: Table
  userEntity: Entity<any>
  eventEntity: Entity<any>
  messageEventEntities: Record<string, Entity<any>>
  textMessageEventEntity: Entity<any>
  connectionEntity: Entity<any>
  constructor(url) {
    try {
      ;[this.tableName, this.region] = url.split('://')[1].split('.')
      this.userEventsTable = getUserEventsTable(this.tableName, this.region)
      this.connectionEntity = getConnectionEntity(this.userEventsTable)
      this.userEntity = getUserEntity(this.userEventsTable)
      this.messageEventEntities = getMessageEventEntities(this.userEventsTable)
    } catch (e) {
      console.log({ e })
    }
  }

  async addConnection(websocketId) {
    await this.connectionEntity.put({
      websocketId: websocketId,
      [`${SORT_KEY_NAME}`]: websocketId,
    })
  }

  async updateConnection(websocketId, userId) {
    await this.connectionEntity.update({
      websocketId: websocketId,
      [`${SORT_KEY_NAME}`]: websocketId,
      userId,
    })
  }

  async deleteConnection(websocketId) {
    await this.connectionEntity.delete({
      websocketId: websocketId,
      [`${SORT_KEY_NAME}`]: websocketId,
    })
  }

  async getUser(id) {
    const userById = {
      id: id,
      SK: id,
    }
    const result = await this.userEntity.get(userById)
    if (Object.keys(result).length === 0) return undefined
    return result.Item
  }

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
  getEvent(id) {} // TODO: Implement

  async saveEvent(event: BotonicEvent): Promise<BotonicEvent> {
    if (event.eventType === EventTypes.MESSAGE) {
      await this.messageEventEntities[event.type].put(event)
    }
    // TODO: Implementation of other event types
    return event
  }

  async getUserByWebsocketId(websocketId) {
    const result = await this.userEventsTable.query(websocketId, {
      index: GLOBAL_SECONDARY_INDEX_NAME,
    })
    if (result.Count === 0) return undefined
    return result.Items[0]
  }
}
