import { BotonicEvent } from '@botonic/core/src/models/events'
import { User } from '@botonic/core/src/models/user'
import { JsonDB } from 'node-json-db'
import { Config } from 'node-json-db/dist/lib/JsonDBConfig'

import { DataProvider } from '.'

export class LocalDevDataProvider implements DataProvider {
  private readonly DB_PATH = 'tmp/localDb'
  private readonly SEPARATOR = '/'
  private readonly paths = {
    USERS: '/users',
    EVENTS: '/events',
    CONNECTIONS: '/connections',
  }
  db: JsonDB

  constructor() {
    this.db = new JsonDB(new Config(this.DB_PATH, true, false, this.SEPARATOR))
  }

  getUsers(limit = 10, offset = 0): User[] {
    const path = this.paths.USERS
    try {
      const userList = this.db.getObject<Record<string, User>>(path)
      const users = Object.values(userList)
      const from = offset * limit
      const to = limit !== 0 ? from + limit : undefined
      return users.slice(from, to)
    } catch (e) {
      console.error('Error fetching users from local DB', e)
    }
    return []
  }

  getUser(userId: string): User | undefined {
    const path = this.createPath([this.paths.USERS, userId])
    try {
      return this.db.exists(path) ? this.db.getObject<User>(path) : undefined
    } catch (e) {
      console.error(`Error fetching user with ID '${userId}' from local DB`, e)
    }
    return undefined
  }

  saveUser(user: User): User {
    const path = this.createPath([this.paths.USERS, user.id])
    try {
      this.db.push(path, user, false)
    } catch (e) {
      console.error(`Error saving user with ID '${user.id}' to local DB`, e)
    }
    return user
  }

  updateUser(user: User): User {
    const path = this.createPath([this.paths.USERS, user.id])
    try {
      this.db.push(path, user, true)
    } catch (e) {
      console.error(`Error updating user with ID '${user.id}' to local DB`, e)
    }
    return user
  }

  getEvents(limit = 10, offset = 0): BotonicEvent[] {
    const path = this.paths.EVENTS
    try {
      const eventList = this.db.getObject<Record<string, BotonicEvent>>(path)
      const events = Object.values(eventList)
      const from = offset * limit
      const to = limit !== 0 ? from + limit : undefined
      return events.slice(from, to)
    } catch (e) {
      console.error('Error fetching events from local DB', e)
    }
    return []
  }

  getEvent(id: string): BotonicEvent | undefined {
    const path = this.createPath([this.paths.EVENTS, id])
    try {
      return this.db.exists(path)
        ? this.db.getObject<BotonicEvent>(path)
        : undefined
    } catch (e) {
      console.error(`Error fetching event with ID '${id}' from local DB`, e)
    }
    return undefined
  }

  saveEvent(event: BotonicEvent): BotonicEvent {
    const path = this.createPath([this.paths.EVENTS, event.eventId])
    try {
      this.db.push(path, event, false)
    } catch (e) {
      console.error(
        `Error saving event with user ID '${event.userId}' to local DB`,
        e
      )
    }
    return event
  }

  addConnection(websocketId: string) {
    const path = this.createPath([this.paths.CONNECTIONS, websocketId])
    try {
      this.db.push(path, '', false)
    } catch (e) {
      console.error(
        `Error adding connection with ID '${websocketId}' to local DB`,
        e
      )
    }
  }
  updateConnection(websocketId: string, userId: string) {
    const path = this.createPath([this.paths.CONNECTIONS, websocketId])
    try {
      this.db.push(path, userId, true)
    } catch (e) {
      console.error(
        `Error updating connection with ID '${websocketId}' to local DB`,
        e
      )
    }
  }
  deleteConnection(websocketId: string) {
    const path = this.createPath([this.paths.CONNECTIONS, websocketId])
    try {
      this.db.delete(path)
    } catch (e) {
      console.error(
        `Error deleting connection with ID '${websocketId}' to local DB`,
        e
      )
    }
  }

  getUserByWebsocketId(websocketId: string): User | undefined {
    const path = this.paths.USERS
    try {
      this.db.find<User>(path, (user: User) => user.websocketId === websocketId)
    } catch (e) {
      console.error(
        `Error fetching user by websocket ID with ID '${websocketId}' from local DB`,
        e
      )
    }
    return undefined
  }

  private createPath(urlChunks: string[]): string {
    return urlChunks.join(this.SEPARATOR)
  }
}
