import { JsonDB } from 'node-json-db'
import { Config } from 'node-json-db/dist/lib/JsonDBConfig'

import { BotonicEvent, User } from '../models'
import { DataProvider } from './factory'

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
    const to = limit !== 0 ? offset + limit : undefined
    return users.slice(offset, to)
  }

  getUser(userId: string): User | undefined {
    const path = this.createPath([this.paths.USERS, userId])
    this.db.reload()
    return this.db.exists(path) ? this.db.getObject<User>(path) : undefined
  }

  getUserByWebsocketId(websocketId: string): User | undefined {
    return this.getUserByField('websocketId', websocketId)
  }

  getUserByField(field: string, value: any): User | undefined {
    const path = this.paths.USERS
    this.db.reload()
    const dbUser = this.db.exists(path)
      ? this.db.find<User>(path, (user: User) => user[field] === value)
      : undefined
    return dbUser
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

  deleteUser(id: string): User | undefined {
    const path = this.createPath([this.paths.USERS, id])
    this.db.reload()
    const user = this.db.exists(path)
      ? this.db.getObject<User>(path)
      : undefined
    if (user) {
      this.db.delete(path)
      return user
    }
    return undefined
  }

  getEvents(limit = 10, offset = 0): BotonicEvent[] {
    const path = this.paths.EVENTS
    this.db.reload()
    const eventList = this.db.getObject<Record<string, BotonicEvent>>(path)
    const events = Object.values(eventList)
    const to = limit !== 0 ? offset + limit : undefined
    return events.slice(offset, to)
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

  updateEvent(event: BotonicEvent): BotonicEvent {
    const path = this.createPath([this.paths.EVENTS, event.eventId])
    this.db.reload()
    if (this.db.exists(path)) {
      this.db.push(path, event, true)
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

  private createPath(urlChunks: string[]): string {
    return urlChunks.join(this.SEPARATOR)
  }
}
