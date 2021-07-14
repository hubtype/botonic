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

  constructor(url?: string) {
    const dbPath = url ? url.split('://')[1] : this.DB_PATH
    this.db = new JsonDB(new Config(dbPath, true, false, this.SEPARATOR))
  }

  getUsers(limit = 10, offset = 0): User[] {
    const path = this.paths.USERS
    this.db.reload()
    const userList = this.db.getObject<Record<string, User>>(path)
    const users = Object.values(userList)
    const from = offset
    const to = limit !== 0 ? from + limit : undefined
    return users.slice(from, to)
  }

  getUser(userId: string): User | undefined {
    const path = this.createPath([this.paths.USERS, userId])
    this.db.reload()
    return this.db.exists(path) ? this.db.getObject<User>(path) : undefined
  }

  saveUser(user: User): User {
    const path = this.createPath([this.paths.USERS, user.id])
    this.db.reload()
    if (!this.db.exists(path)) {
      this.db.push(path, user)
    }
    return user
  }

  updateUser(user: User): User {
    const path = this.createPath([this.paths.USERS, user.id])
    this.db.reload()
    if (this.db.exists(path)) {
      this.db.push(path, user, true)
    }

    return user
  }

  getEvents(limit = 10, offset = 0): BotonicEvent[] {
    const path = this.paths.EVENTS
    this.db.reload()
    const eventList = this.db.getObject<Record<string, BotonicEvent>>(path)
    const events = Object.values(eventList)
    const from = offset
    const to = limit !== 0 ? from + limit : undefined
    return events.slice(from, to)
  }

  getEvent(id: string): BotonicEvent | undefined {
    const path = this.createPath([this.paths.EVENTS, id])
    this.db.reload()
    return this.db.exists(path)
      ? this.db.getObject<BotonicEvent>(path)
      : undefined
  }

  saveEvent(event: BotonicEvent): BotonicEvent {
    const path = this.createPath([this.paths.EVENTS, event.eventId])
    this.db.reload()
    if (!this.db.exists(path)) {
      this.db.push(path, event)
    }
    return event
  }

  deleteEvent(id: string): BotonicEvent | undefined {
    const path = this.createPath([this.paths.EVENTS, id])
    this.db.reload()
    const event = this.db.exists(path)
      ? this.db.getObject<BotonicEvent>(path)
      : undefined
    if (event) {
      this.db.delete(path)
      return event
    }
    return undefined
  }

  addConnection(websocketId: string) {
    const path = this.createPath([this.paths.CONNECTIONS, websocketId])
    this.db.reload()
    if (!this.db.exists(path)) {
      this.db.push(path, '', false)
    }
  }

  updateConnection(websocketId: string, userId: string) {
    const path = this.createPath([this.paths.CONNECTIONS, websocketId])
    this.db.reload()
    if (this.db.exists(path)) {
      this.db.push(path, userId, true)
    }
  }

  deleteConnection(websocketId: string) {
    const path = this.createPath([this.paths.CONNECTIONS, websocketId])
    this.db.reload()
    this.db.delete(path)
  }

  getUserByWebsocketId(websocketId: string): User | undefined {
    const path = this.paths.USERS
    this.db.reload()
    return this.db.find<User>(
      path,
      (user: User) => user.websocketId === websocketId
    )
  }

  private createPath(urlChunks: string[]): string {
    return urlChunks.join(this.SEPARATOR)
  }
}
